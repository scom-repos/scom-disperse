rm -rf src/contracts &&
mkdir -p src/contracts/oswap-openswap-contract &&
mkdir -p src/contracts/scom-disperse-contract &&
cp -r node_modules/@scom/oswap-openswap-contract/src/* src/contracts/oswap-openswap-contract &&
cp -r repos/scom-disperse-contract/src/* src/contracts/scom-disperse-contract &&
rm -rf src/wallets &&
mkdir -p src/wallets/scom-binance-chain-wallet &&
mkdir -p src/wallets/scom-bit-keep-wallet &&
mkdir -p src/wallets/scom-coin98-wallet &&
mkdir -p src/wallets/scom-frontier-wallet &&
mkdir -p src/wallets/scom-onto-wallet &&
mkdir -p src/wallets/scom-trust-wallet &&
cp -r node_modules/@scom/scom-binance-chain-wallet/src/* src/wallets/scom-binance-chain-wallet &&
cp -r node_modules/@scom/scom-bit-keep-wallet/src/* src/wallets/scom-bit-keep-wallet &&
cp -r node_modules/@scom/scom-coin98-wallet/src/* src/wallets/scom-coin98-wallet &&
cp -r node_modules/@scom/scom-frontier-wallet/src/* src/wallets/scom-frontier-wallet &&
cp -r node_modules/@scom/scom-onto-wallet/src/* src/wallets/scom-onto-wallet &&
cp -r node_modules/@scom/scom-trust-wallet/src/* src/wallets/scom-trust-wallet &&
cp -r src/wallets/scom-binance-chain-wallet/img/* src/img &&
cp -r src/wallets/scom-bit-keep-wallet/img/* src/img &&
cp -r src/wallets/scom-coin98-wallet/img/* src/img &&
cp -r src/wallets/scom-frontier-wallet/img/* src/img &&
cp -r src/wallets/scom-onto-wallet/img/* src/img &&
cp -r src/wallets/scom-trust-wallet/img/* src/img