// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Factory {
    address[] public deployedCampaigns;

    function createCampaign(uint _minContribution) public {
        deployedCampaigns.push(address(new Campaign(msg.sender, _minContribution)));
    }

    function getAllCampaigns() public view returns(address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
    }

    address public manager;
    uint public minContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    uint public numRequests;
    mapping(uint => Request) public requests;


    modifier onlyOwner() {
        require(msg.sender == manager, "Only the manager can call this function");
        _;
    }

    constructor(address _manager, uint _minContribution) {
        manager = _manager;
        minContribution = _minContribution;
    }

    function contribute() public payable {
        require(msg.value > minContribution, "You are trying to contribute less than the minimum.");
        if (!approvers[msg.sender]) {
            approversCount++;
        }
        approvers[msg.sender] = true;
    }

    function createRequest(string memory _description, uint _value, address _recipient) public onlyOwner {
        Request storage newRequest = requests[numRequests++];
        newRequest.description = _description;
        newRequest.value = _value;
        newRequest.recipient = _recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint _index) public {
        require(approvers[msg.sender], "You can't approve this request");
        
        Request storage request = requests[_index];
        require(!request.approvals[msg.sender], "You already voted this request");
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint _index) public payable onlyOwner {
        Request storage request = requests[_index];
        require(!request.complete, "The request was already finalized");
        require(request.approvalCount > (approversCount / 2), "The request has to be approved by at least half the contributors");
        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }
}