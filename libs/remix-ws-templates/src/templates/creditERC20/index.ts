export default async () => {
  return {
    'contracts/CreditERC20.sol': `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract CreditERC20 is ERC20, Ownable {
    constructor(string memory name_, string memory symbol_, address owner_, uint256 initialSupply)
        ERC20(name_, symbol_)
        Ownable(owner_)
    {
        _mint(owner_, initialSupply);
    }
}
`,
    'test/CreditERC20.t.sol': `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {CreditERC20} from "../contracts/CreditERC20.sol";

contract CreditERC20Test is Test {
    function testInitialSupplyBelongsToOwner() public {
        address owner = address(0xA11CE);
        CreditERC20 token = new CreditERC20("Credit Token", "CREDIT", owner, 100 ether);
        assertEq(token.balanceOf(owner), 100 ether);
    }
}
`,
    'script/DeployCreditERC20.s.sol': `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {CreditERC20} from "../contracts/CreditERC20.sol";

contract DeployCreditERC20 is Script {
    function run() external returns (CreditERC20 token) {
        address owner = vm.envAddress("DEPLOY_OWNER");
        uint256 supply = vm.envUint("INITIAL_SUPPLY");
        vm.startBroadcast();
        token = new CreditERC20("Credit Token", "CREDIT", owner, supply);
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
    'README.generated.md': `# CreditERC20

CreditERC20 is a minimal OpenZeppelin ERC20 template for CreditChain projects.

## Safety Notes

- Owner receives the initial supply.
- Use a multisig for production ownership.
- Review token economics before deployment.
- Verify source after deployment on CreditChain Scan.

## Foundry Commands

\`\`\`bash
forge build
forge test
DEPLOY_OWNER=0x0000000000000000000000000000000000000000 INITIAL_SUPPLY=100000000000000000000 forge script script/DeployCreditERC20.s.sol --rpc-url creditchain_testnet --broadcast
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
