let recognition = null;
let isRecording = false;
let finalTranscript = "";

const startBtn = document.getElementById('start-btn');
const endBtn = document.getElementById('end-btn');
const transcriptBox = document.getElementById('transcript-box');
const summaryBox = document.getElementById('summary-box');
const recordingBadge = document.getElementById('recording-badge');
const recordingPulseRing = document.getElementById('recording-pulse-ring');
const audioVisualizer = document.getElementById('audio-visualizer');
const callStatusText = document.getElementById('call-status-text');

function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Your browser does not support the Web Speech API. Please use Google Chrome.");
        return false;
    }
    
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                currentFinal += event.results[i][0].transcript + '. ';
                finalTranscript += event.results[i][0].transcript + '. ';
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        if (currentFinal) {
            const p = document.createElement('p');
            p.className = "mb-2 text-slate-800";
            p.innerHTML = `<strong class="text-blue-600">You:</strong> ${currentFinal}`;
            transcriptBox.appendChild(p);
        }
        
        let interimSpan = document.getElementById('interim-span');
        if (!interimSpan) {
            interimSpan = document.createElement('span');
            interimSpan.id = 'interim-span';
            interimSpan.className = 'text-slate-400 italic';
            transcriptBox.appendChild(interimSpan);
        }
        interimSpan.innerText = interimTranscript;
        transcriptBox.scrollTop = transcriptBox.scrollHeight;
    };

    recognition.onend = () => {
        if (isRecording && recognition) { 
            try { recognition.start(); } catch(e){} 
        }
    };
    
    return true;
}

window.startMeeting = function() {
    const hasMicSupport = initSpeechRecognition();
    if (!hasMicSupport) return;
    
    isRecording = true; 
    finalTranscript = ""; 
    
    transcriptBox.innerHTML = '<p class="text-emerald-500 text-xs font-bold mb-4 uppercase tracking-wide">Microphone Active - Listening...</p>';
    if(summaryBox) {
        summaryBox.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-slate-400">
                <i class="ph ph-brain text-4xl mb-2 opacity-50"></i>
                <p class="text-xs text-center px-4">Summary will automatically generate when the call ends.</p>
            </div>`;
    }
    
    startBtn.classList.add('hidden');
    endBtn.classList.remove('hidden');
    if(recordingBadge) recordingBadge.classList.remove('hidden');
    if(recordingPulseRing) recordingPulseRing.classList.remove('hidden');
    if(audioVisualizer) audioVisualizer.classList.remove('hidden');
    if(callStatusText) callStatusText.innerText = "Listening in progress...";
    
    try {
        recognition.start();
    } catch (e) {
        console.error("Microphone error:", e);
        transcriptBox.innerHTML = '<p class="text-red-500 text-xs font-bold mb-4">Error: Could not access microphone.</p>';
    }
}

window.endMeeting = function() {
    isRecording = false;
    if(recognition) {
        try { recognition.stop(); } catch(e) {}
    }
    
    endBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    if(recordingBadge) recordingBadge.classList.add('hidden');
    if(recordingPulseRing) recordingPulseRing.classList.add('hidden');
    if(audioVisualizer) audioVisualizer.classList.add('hidden');
    if(callStatusText) callStatusText.innerText = "Call ended";
    startBtn.innerHTML = '<i class="ph ph-phone-call text-lg"></i> Start New Call';
    
    const interim = document.getElementById('interim-span');
    if(interim) interim.remove();

    generateCRMSummary(finalTranscript);
}

async function generateCRMSummary(transcriptText) {
    if (!summaryBox) return;

    if (!transcriptText || transcriptText.trim() === "") {
        summaryBox.innerHTML = `<p class="text-red-500 text-sm p-4 bg-red-50 rounded-lg">No speech detected to summarize.</p>`;
        return;
    }

    summaryBox.innerHTML = `
        <div class="space-y-4">
            <div class="h-4 w-3/4 rounded bg-slate-200 animate-pulse"></div>
            <div class="h-4 w-full rounded bg-slate-200 animate-pulse"></div>
            <div class="h-4 w-5/6 rounded bg-slate-200 animate-pulse"></div>
            <div class="h-20 w-full rounded bg-slate-200 animate-pulse mt-4"></div>
            <p class="text-xs text-center text-indigo-500 font-semibold animate-pulse mt-4">Gemini is analyzing the conversation...</p>
        </div>
    `;

    try {
        const response = await fetch('http://127.0.0.1:8000/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcript: transcriptText })
        });

        if (!response.ok) throw new Error("Backend connection failed.");

        const data = await response.json();

        summaryBox.innerHTML = `
            <div class="space-y-4 text-sm text-slate-800">
                <div>
                    <h4 class="font-bold text-indigo-600 border-b border-slate-200 pb-1 mb-2">Executive Summary</h4>
                    <p>${data.compliance_summary}</p>
                </div>
                
                <div>
                    <h4 class="font-bold text-indigo-600 border-b border-slate-200 pb-1 mb-2">Action Items</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        ${data.action_items.map(item => `
                            <li><strong>${item.assignee}:</strong> ${item.task}</li>
                        `).join('')}
                    </ul>
                </div>

                <div class="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <h4 class="font-bold text-indigo-900 text-xs uppercase mb-2">Draft Client Email</h4>
                    <p class="whitespace-pre-line text-indigo-800 italic">${data.client_email_draft}</p>
                </div>
                
                <button class="mt-4 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-2">
                    <i class="ph ph-floppy-disk"></i> Save to CRM
                </button>
            </div>
        `;

    } catch (error) {
        console.error(error);
        summaryBox.innerHTML = `
            <div class="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm">
                <p class="font-bold mb-1"><i class="ph ph-warning-circle"></i> Connection Failed</p>
                <p class="text-xs text-red-500 mb-2">Could not connect to the Python backend.</p>
                <p class="text-xs text-slate-500">Make sure your Uvicorn server is running on port 8000.</p>
            </div>
        `;
    }
}