@echo off

where node.exe >nul 2>&1 || goto NodeMissing

set taskname=get-my-ps5
set starttime=14:00
set duration=4:00
set schedule=DAILY

SCHTASKS /Query /TN %taskname% >NUL 2>&1

if %errorlevel% NEQ 0 (
    SCHTASKS /Create /RU %username% /IT /TN %taskname% /SC %schedule% /ST %starttime% /DU %duration% /TR "%~dp0%taskname%.cmd" /F || goto UACPrompt
	echo @cd /d "%~dp0" > "%~dp0%taskname%.cmd"
	echo @if not exist node_modules call npm install >> "%~dp0%taskname%.cmd"
	echo @call npm run watch >> "%~dp0%taskname%.cmd"
	echo.
	echo Created %taskname% task to run at %starttime% for %duration% hours...
	ping 127.0.0.1 -n 6 > nul
) else (
    echo Removing %taskname% task...
    SCHTASKS /Delete /TN %taskname% /F
	del "%~dp0%taskname%.cmd"
	ping 127.0.0.1 -n 3 > nul
)

if exist "%temp%\%taskname%.vbs" ( del "%temp%\%taskname%.vbs" )
exit /B

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\%taskname%.vbs"
    echo UAC.ShellExecute "%~dpf0", "", "", "runas", 1 >> "%temp%\%taskname%.vbs"

    "%temp%\%taskname%.vbs"
    exit /B

:NodeMissing
	echo This requires Node.js, launching the download page.
	
	ping 127.0.0.1 -n 6 > nul
	
	start https://nodejs.org/en/
	exit /B