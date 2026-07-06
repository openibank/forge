// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @title CreditForgeLifecycle
/// @notice Small lifecycle contract used to prove CreditForge compile, test, deploy,
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
            requester: msg.sender, amount: amount, feeBps: feeBps, timestamp: block.timestamp, workspace: workspace
        });

        if (fee > 0) {
            (bool sent,) = payable(treasury).call{value: fee}("");
            if (!sent) revert TreasuryTransferFailed();
        }

        emit BuildSettled(buildId, msg.sender, amount, fee, treasury, workspace);
    }
}
