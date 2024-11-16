while true; do
    echo "Running SendMirrorOracleMessageScript"

    timeout 145s forge script SendMirrorOracleMessageScript --fork-url https://polygon.llamarpc.com --broadcast -vv
    if [ $? -eq 124 ]; then
        echo "SendMirrorOracleMessageScript timed out"
    else
        echo "SendMirrorOracleMessageScript finished"
    fi
    sleep 1 #Wait for 1 second

done