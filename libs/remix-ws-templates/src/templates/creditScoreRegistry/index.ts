export default async () => {
  return {
    'contracts/CreditScoreRegistry.sol': `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title CreditScoreRegistry
/// @notice CreditChain template for publishing score attestations with off-chain evidence.
/// @dev Scores are intentionally minimal: store provenance hashes and URIs, not sensitive personal data.
contract CreditScoreRegistry {
    struct ScoreRecord {
        uint16 score;
        uint64 updatedAt;
        bytes32 evidenceHash;
        string evidenceURI;
    }

    address public owner;
    mapping(address => bool) public scoreUpdater;
    mapping(address => ScoreRecord) private scores;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event ScoreUpdaterSet(address indexed updater, bool enabled);
    event ScoreUpdated(address indexed subject, uint16 score, bytes32 indexed evidenceHash, string evidenceURI);

    error NotOwner();
    error NotScoreUpdater();
    error InvalidOwner();
    error InvalidSubject();
    error ScoreOutOfRange();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyScoreUpdater() {
        if (!scoreUpdater[msg.sender]) revert NotScoreUpdater();
        _;
    }

    constructor(address initialOwner) {
        if (initialOwner == address(0)) revert InvalidOwner();
        owner = initialOwner;
        scoreUpdater[initialOwner] = true;
        emit OwnershipTransferred(address(0), initialOwner);
        emit ScoreUpdaterSet(initialOwner, true);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidOwner();
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function setScoreUpdater(address updater, bool enabled) external onlyOwner {
        if (updater == address(0)) revert InvalidSubject();
        scoreUpdater[updater] = enabled;
        emit ScoreUpdaterSet(updater, enabled);
    }

    function updateScore(
        address subject,
        uint16 score,
        bytes32 evidenceHash,
        string calldata evidenceURI
    ) external onlyScoreUpdater {
        if (subject == address(0)) revert InvalidSubject();
        if (score > 1000) revert ScoreOutOfRange();

        scores[subject] = ScoreRecord({
            score: score,
            updatedAt: uint64(block.timestamp),
            evidenceHash: evidenceHash,
            evidenceURI: evidenceURI
        });

        emit ScoreUpdated(subject, score, evidenceHash, evidenceURI);
    }

    function getScore(address subject) external view returns (ScoreRecord memory) {
        return scores[subject];
    }
}
`,
    'test/CreditScoreRegistry.t.sol': `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/CreditScoreRegistry.sol";

contract CreditScoreRegistryTest is Test {
    CreditScoreRegistry registry;
    address subject = address(0xBEEF);

    function setUp() public {
        registry = new CreditScoreRegistry(address(this));
    }

    function testOwnerCanPublishScore() public {
        bytes32 evidenceHash = keccak256("creditchain:evidence:v1");
        registry.updateScore(subject, 720, evidenceHash, "ipfs://evidence");

        CreditScoreRegistry.ScoreRecord memory record = registry.getScore(subject);
        assertEq(record.score, 720);
        assertEq(record.evidenceHash, evidenceHash);
        assertEq(record.evidenceURI, "ipfs://evidence");
    }

    function testRejectsScoresAboveRange() public {
        vm.expectRevert(CreditScoreRegistry.ScoreOutOfRange.selector);
        registry.updateScore(subject, 1001, bytes32(0), "");
    }
}
`,
    'script/DeployCreditScoreRegistry.s.sol': `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../contracts/CreditScoreRegistry.sol";

contract DeployCreditScoreRegistry is Script {
    function run() external returns (CreditScoreRegistry registry) {
        vm.startBroadcast();
        registry = new CreditScoreRegistry(msg.sender);
        vm.stopBroadcast();
    }
}
`,
    'foundry.toml': `[profile.default]
src = "contracts"
out = "out"
libs = ["lib"]
solc_version = "0.8.24"
optimizer = true
optimizer_runs = 200

[rpc_endpoints]
creditchain_testnet = "https://testnet-rpc.creditchain.org"
creditchain_mainnet = "https://rpc.creditchain.org"
`,
    'README.generated.md': `# Credit Score Registry

This Forge template creates a CreditChain-oriented score attestation registry.

## What it stores

- Subject wallet address
- Score from 0 to 1000
- Evidence hash
- Evidence URI
- Update timestamp

## Safety notes

- Do not store personal or regulated credit data directly on-chain.
- Store only hashes, content-addressed references, or public attestations.
- Replace placeholder CreditChain RPC values in \`foundry.toml\` before production deployment.
- Deployments should be verified and published to the future CreditChain Contract Passport registry.

## Foundry commands

\`\`\`bash
forge build
forge test
forge script script/DeployCreditScoreRegistry.s.sol --rpc-url creditchain_testnet --broadcast
\`\`\`
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
