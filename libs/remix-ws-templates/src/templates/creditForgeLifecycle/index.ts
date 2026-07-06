export default async () => {
  return {
    'contracts/CreditForgeLifecycle.sol': `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @title CreditForgeLifecycle
/// @notice Small lifecycle contract used to prove Forge compile, test, deploy,
/// verify, monitor, and explorer-link workflows against CreditChain environments.
contract CreditForgeLifecycle {
    address public immutable operator;
    address public treasury;
    uint16 public feeBps;
    uint16 public constant MAX_FEE_BPS = 250;
    uint256 public buildCount;

    mapping(bytes32 buildId => BuildReceipt) public receipts;

    struct BuildReceipt {
        address requester;
        uint256 amount;
        uint16 feeBps;
        uint256 timestamp;
        string workspace;
    }

    event TreasuryUpdated(address indexed treasury);
    event FeeUpdated(uint16 feeBps);
    event BuildSettled(
        bytes32 indexed buildId,
        address indexed requester,
        uint256 amount,
        uint256 fee,
        address indexed treasury,
        string workspace
    );

    error NotOperator();
    error ZeroAddress();
    error FeeTooHigh();
    error DuplicateBuild();
    error InvalidPayment();
    error TreasuryTransferFailed();

    modifier onlyOperator() {
        if (msg.sender != operator) revert NotOperator();
        _;
    }

    constructor(address initialTreasury) {
        if (initialTreasury == address(0)) revert ZeroAddress();
        operator = msg.sender;
        treasury = initialTreasury;
    }

    function setTreasury(address nextTreasury) external onlyOperator {
        if (nextTreasury == address(0)) revert ZeroAddress();
        treasury = nextTreasury;
        emit TreasuryUpdated(nextTreasury);
    }

    function setFeeBps(uint16 nextFeeBps) external onlyOperator {
        if (nextFeeBps > MAX_FEE_BPS) revert FeeTooHigh();
        feeBps = nextFeeBps;
        emit FeeUpdated(nextFeeBps);
    }

    function quoteFee(uint256 amount) public view returns (uint256) {
        return (amount * feeBps) / 10_000;
    }

    function settleBuild(bytes32 buildId, uint256 amount, string calldata workspace)
        external
        payable
        returns (uint256 fee)
    {
        if (receipts[buildId].timestamp != 0) revert DuplicateBuild();
        if (msg.value != amount) revert InvalidPayment();

        fee = quoteFee(amount);
        buildCount += 1;
        receipts[buildId] = BuildReceipt({
            requester: msg.sender,
            amount: amount,
            feeBps: feeBps,
            timestamp: block.timestamp,
            workspace: workspace
        });

        if (fee > 0) {
            (bool sent,) = payable(treasury).call{value: fee}("");
            if (!sent) revert TreasuryTransferFailed();
        }

        emit BuildSettled(buildId, msg.sender, amount, fee, treasury, workspace);
    }
}
`,
    'test/CreditForgeLifecycle.t.sol': `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {CreditForgeLifecycle} from "../contracts/CreditForgeLifecycle.sol";

contract CreditForgeLifecycleTest is Test {
    CreditForgeLifecycle lifecycle;
    address treasury = address(0xBEEF);

    function setUp() public {
        lifecycle = new CreditForgeLifecycle(treasury);
    }

    function testOperatorCanSetFee() public {
        lifecycle.setFeeBps(125);
        assertEq(lifecycle.feeBps(), 125);
        assertEq(lifecycle.quoteFee(1 ether), 0.0125 ether);
    }

    function testRejectsHighFee() public {
        vm.expectRevert(CreditForgeLifecycle.FeeTooHigh.selector);
        lifecycle.setFeeBps(251);
    }

    function testSettlesBuild() public {
        bytes32 buildId = keccak256("creditchain:build:1");
        uint256 fee = lifecycle.settleBuild{value: 1 ether}(buildId, 1 ether, "merchant-pos");

        assertEq(fee, 0);
        assertEq(lifecycle.buildCount(), 1);
    }
}
`,
    'script/DeployCreditForgeLifecycle.s.sol': `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {CreditForgeLifecycle} from "../contracts/CreditForgeLifecycle.sol";

contract DeployCreditForgeLifecycle is Script {
    function run() external returns (CreditForgeLifecycle lifecycle) {
        address treasury = vm.envAddress("TREASURY_ADDRESS");
        vm.startBroadcast();
        lifecycle = new CreditForgeLifecycle(treasury);
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
    'README.generated.md': `# CreditForge Lifecycle

This template proves the Forge loop against CreditChain: compile, test, deploy,
verify, monitor, and link to explorer data without asking users for raw private
keys or seed phrases.

## Foundry Commands

\`\`\`bash
forge build
forge test
TREASURY_ADDRESS=$TREASURY_ADDRESS forge script script/DeployCreditForgeLifecycle.s.sol --rpc-url creditchain_testnet --broadcast
\`\`\`

## Deployment Policy

- Use a Foundry keystore account or secure CI signer.
- Review fee recipient, treasury ownership, and admin powers before deployment.
- Verify the contract on CreditChain Scan after deployment.
`,
    'remix.config.json': `{
  "remappings": [],
  "optimizer": {
    "enabled": true,
    "runs": 200
  }
}
`
  }
}
