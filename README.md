Repo for the udemy course [Ethereum and Solidity: The Complete Developer's Guide
](https://udemy.com/course/ethereum-and-solidity-the-complete-developers-guide).

## Final full-stack project

The final project is deployed at https://solidity-course.vercel.app/

It's a full-stack project consisting of:

- Solidity contracts
- Contracts deployment to the ropsten network
- NextJS frontend with web3.js
- Frontend deployment to vercel

### Main features:

- Any address can create a campaign and they'll be their manager
- Any address can contribute the minum requirement amount to any campaign, becoming then a verified approver
- The manager can create spending requests, which will then have to be approved by at least half the verified approvers
- Verified approvers can accept spending requests created by the manager
- Once the minimum amount of approvers accepted a given request, the manager can finalize said request processing the payment and sending funds from the campaign to the selected recipient

### Example use case:

- Address 0x123 create a campaign to collect funds for writing a novel, with a minimum contribution of 0.5 ETH
- 0xabc, 0x456 and 0x999 contribute 1 ETH each to the campaign. The campaign has now a balance of 3 ETH
- The manager (0x123) creates a spending request for sending 2 ETH to the printing company address (0xpR1nt)
- 0xabc approves the request. The manager cannot finalize the request as there are only 1/3 approvals
- 0x456 approves the request as well
- We reached a quorum of at least half the approvals. The manager (0x123) can finalize the request and 2 ETH will be sent to the printing company address (0xpR1nt)
- The final balance on the campaign address is 1 ETH
