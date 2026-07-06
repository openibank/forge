// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {CreditForgeLifecycle} from "../src/CreditForgeLifecycle.sol";

contract CreditForgeLifecycleTest {
    function testOperatorCanSetBoundedFee() public {
        CreditForgeLifecycle lifecycle = new CreditForgeLifecycle(address(0xBEEF));
        lifecycle.setFeeBps(125);
        require(lifecycle.feeBps() == 125, "fee not set");
        require(lifecycle.quoteFee(10_000) == 125, "quote mismatch");
    }

    function testBuildSettlementCreatesReceipt() public {
        CreditForgeLifecycle lifecycle = new CreditForgeLifecycle(address(0xBEEF));
        lifecycle.setFeeBps(100);

        bytes32 buildId = keccak256("creditforge-build-1");
        uint256 fee = lifecycle.settleBuild{value: 1_000 ether}(buildId, 1_000 ether, "examples/creditchain-lifecycle");
        require(fee == 10 ether, "fee mismatch");
        require(lifecycle.buildCount() == 1, "build count mismatch");
        require(address(lifecycle).balance == 990 ether, "escrow balance mismatch");

        (address requester, uint256 amount, uint16 feeBps, uint256 timestamp, string memory workspace) =
            lifecycle.receipts(buildId);

        require(requester == address(this), "requester mismatch");
        require(amount == 1_000 ether, "amount mismatch");
        require(feeBps == 100, "receipt fee mismatch");
        require(timestamp > 0, "timestamp missing");
        require(keccak256(bytes(workspace)) == keccak256("examples/creditchain-lifecycle"), "workspace mismatch");
    }

    function testCannotSetFeeAboveCap() public {
        CreditForgeLifecycle lifecycle = new CreditForgeLifecycle(address(0xBEEF));

        try lifecycle.setFeeBps(251) {
            revert("expected FeeTooHigh");
        } catch (bytes memory) {
            require(lifecycle.feeBps() == 0, "fee changed");
        }
    }

    function testCannotDuplicateBuildReceipt() public {
        CreditForgeLifecycle lifecycle = new CreditForgeLifecycle(address(0xBEEF));
        bytes32 buildId = keccak256("creditforge-build-1");
        lifecycle.settleBuild{value: 100}(buildId, 100, "workspace");

        try lifecycle.settleBuild{value: 100}(buildId, 100, "workspace") {
            revert("expected DuplicateBuild");
        } catch (bytes memory) {
            require(lifecycle.buildCount() == 1, "duplicate counted");
        }
    }

    function testCannotSettleWithMismatchedPayment() public {
        CreditForgeLifecycle lifecycle = new CreditForgeLifecycle(address(0xBEEF));

        try lifecycle.settleBuild{value: 99}(keccak256("creditforge-build-2"), 100, "workspace") {
            revert("expected InvalidPayment");
        } catch (bytes memory) {
            require(lifecycle.buildCount() == 0, "mismatch counted");
        }
    }
}
