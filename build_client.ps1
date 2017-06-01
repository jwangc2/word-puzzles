$invocation = (Get-Variable MyInvocation).Value
$directorypath = Split-Path $invocation.MyCommand.Path
echo 'Packing source...'
cd '.\src\js'
webpack -p
cd $directorypath
echo 'Copying to public...'
cp '.\src\js\bundle.js' '.\public\js\bundle.js'
echo 'Completed!'