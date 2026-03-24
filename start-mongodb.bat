@echo off
REM Create MongoDB data directory if it doesn't exist
if not exist "C:\Users\eFASTGH\MongoDB\data\db" mkdir "C:\Users\eFASTGH\MongoDB\data\db"

REM Start MongoDB
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath="C:\Users\eFASTGH\MongoDB\data\db"
