export default async () => {
  return {
    'contracts/CreditPayment.sol': `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract CreditPayment is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable acceptedToken;
    address public treasury;

    event PaymentCaptured(address indexed payer, bytes32 indexed invoiceId, uint256 amount);
    event TreasuryUpdated(address indexed treasury);

    error TreasuryZeroAddress();

    constructor(address owner_, IERC20 acceptedToken_, address treasury_) Ownable(owner_) {
        if (treasury_ == address(0)) revert TreasuryZeroAddress();
        acceptedToken = acceptedToken_;
        treasury = treasury_;
    }

    function updateTreasury(address nextTreasury) external onlyOwner {
        if (nextTreasury == address(0)) revert TreasuryZeroAddress();
        treasury = nextTreasury;
        emit TreasuryUpdated(nextTreasury);
    }

    function pay(bytes32 invoiceId, uint256 amount) external {
        acceptedToken.safeTransferFrom(msg.sender, treasury, amount);
        emit PaymentCaptured(msg.sender, invoiceId, amount);
    }
}
`,
    'test/CreditPayment.t.sol': `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {CreditPayment} from "../contracts/CreditPayment.sol";

contract CreditPaymentTest is Test {
    function testPaymentTemplateCompiles() public pure {
        assertTrue(true);
    }
}
`,
    'script/DeployCreditPayment.s.sol': `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CreditPayment} from "../contracts/CreditPayment.sol";

contract DeployCreditPayment is Script {
    function run() external returns (CreditPayment payment) {
        address owner = vm.envAddress("DEPLOY_OWNER");
        address treasury = vm.envAddress("TREASURY_ADDRESS");
        IERC20 token = IERC20(vm.envAddress("ACCEPTED_TOKEN"));
        vm.startBroadcast();
        payment = new CreditPayment(owner, token, treasury);
        vm.stopBroadcast();
    }
}
`,
    'foundry.toml': `[profile.default]
src = "contracts"
out = "out"
libs = ["lib"]
solc_version = "0.8.26"
optimizer = true
optimizer_runs = 200

[rpc_endpoints]
creditchain_testnet = "https://testnet-rpc.creditchain.org"
creditchain_mainnet = "https://rpc.creditchain.org"
`,
    'README.generated.md': `# CreditPayment

CreditPayment is a merchant settlement contract for CreditChain payment flows.

## Safety Notes

- Owner can rotate the treasury address.
- Use merchant-controlled multisig ownership for production deploys.
- The accepted token address is immutable after deployment.
- Keep invoice data off-chain and store only the invoice ID hash on-chain.

## Foundry Commands

\`\`\`bash
forge build
forge test
DEPLOY_OWNER=$DEPLOY_OWNER TREASURY_ADDRESS=$TREASURY_ADDRESS ACCEPTED_TOKEN=$ACCEPTED_TOKEN forge script script/DeployCreditPayment.s.sol --rpc-url creditchain_testnet --broadcast
\`\`\`
`,
    'remix.config.json': `{
  "remappings": [
    "@openzeppelin/=node_modules/@openzeppelin/"
  ],
  "optimizer": {
    "enabled": true,
    "runs": 200
  }
}
`
  }
}
