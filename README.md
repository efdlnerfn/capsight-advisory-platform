# Sustainable Tomorrow Hackathon Project
to us the AI listener feature
write this in the terminal (make sure it is under the file directory)
-------------------------------------------------------------------------
Step one python -m venv .venv

Step two .venv/Scripts/python.exe -m pip install fastapi uvicorn pydantic google-genai

Step three .venv/Scripts/python.exe -m uvicorn main:app --reload --port 8000

Step four open a new terminal and run: python -m http.server 5500

---------------------------------------------------------------------------
