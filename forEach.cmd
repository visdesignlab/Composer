@echo off

shift
for /d %%f in ("*") do (
  if exist "%%f\package.json" (
    cd %%f
    echo on %%f execute: %*
    echo #####################
    %*
    cd ..
  )
)
