@ECHO OFF
start . && start "" "%PROGRAMFILES%\Git\bin\sh.exe" --login && adonis serve --dev
PAUSE