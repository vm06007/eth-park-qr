while true; do
    echo "Running UpdateOracleOnArbitrum"

    timeout 145s forge script MirrorOracleUpdateScript --fork-url https://arb1.arbitrum.io/rpc --broadcast -vv
    if [ $? -eq 124 ]; then
        echo "UpdateOracleOnArbitrum timed out"
    else
        echo "UpdateOracleOnArbitrum finished"
    fi
    sleep 1 #Wait for 1 second

done