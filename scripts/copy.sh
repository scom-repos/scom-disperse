rm -rf src/contracts &&
mkdir -p src/contracts/scom-disperse-contract &&
mkdir -p src/contracts/scom-commission-proxy-contract &&
cp -r node_modules/@scom/scom-disperse-contract/src/* src/contracts/scom-disperse-contract &&
cp -r node_modules/@scom/scom-commission-proxy-contract/src/* src/contracts/scom-commission-proxy-contract