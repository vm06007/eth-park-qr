while true; do
    echo "Running EventBotTest"

    timeout 45s node EventBotTest.js
    if [ $? -eq 124 ]; then
        echo "EventBotTest timed out"
    else
        echo "EventBotTest finished"
    fi
    sleep 1 #Wait for 1 second

done