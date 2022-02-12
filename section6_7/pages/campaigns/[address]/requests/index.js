import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Message, Table, Label } from "semantic-ui-react";
import React, { useCallback } from "react";
import web3 from "../../../../eth/web3";
import factory from "../../../../eth/factory";
import getCampaignInstance from "../../../../eth/campaign";

export default function Requests({ requests, approvers }) {
  const router = useRouter();
  const { address } = router.query;
  const [error, setError] = useState();
  const [isApproveLoading, setIsApproveLoading] = useState(new Map());
  const [isFinalizeLoading, setIsFinalizeLoading] = useState(new Map());

  const onApprove = useCallback(async (id) => {
    setIsApproveLoading(new Map(isApproveLoading).set(id, true));
    const accounts = await web3.eth.getAccounts();
    const campaign = getCampaignInstance(address);
    try {
      await campaign.methods.approveRequest(id).send({ from: accounts[0] });
    } catch (e) {
      setError(e);
      setIsApproveLoading(new Map(isApproveLoading).set(id, false));
    }
    setIsApproveLoading(new Map(isApproveLoading).set(id, false));
  });

  const onFinalize = useCallback(async (id) => {
    setIsFinalizeLoading(new Map(isFinalizeLoading).set(id, true));
    const accounts = await web3.eth.getAccounts();
    const campaign = getCampaignInstance(address);
    try {
      await campaign.methods.finalizeRequest(id).send({ from: accounts[0] });
    } catch (e) {
      setError(e);
      setIsFinalizeLoading(new Map(isFinalizeLoading).set(id, false));
    }
    setIsFinalizeLoading(new Map(isFinalizeLoading).set(id, false));
  });

  return (
    <>
      <h2>Requests</h2>
      {error && (
        <Message negative>
          <Message.Header>Something went wrong</Message.Header>
          <p>{JSON.stringify(error.message)}</p>
        </Message>
      )}
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Id</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Recipient</Table.HeaderCell>
            <Table.HeaderCell>Approval Count</Table.HeaderCell>
            <Table.HeaderCell>Complete</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {requests.map(
            (
              { id, description, value, recipient, complete, approvalCount },
              i
            ) => (
              <Table.Row key={id} disabled={complete}>
                <Table.Cell>
                  {complete && <Label ribbon>Done</Label>}
                  {i}
                </Table.Cell>
                <Table.Cell>{description}</Table.Cell>
                <Table.Cell>
                  {web3.utils.fromWei(value, "ether")} ether
                </Table.Cell>
                <Table.Cell>{recipient}</Table.Cell>
                <Table.Cell>
                  {approvalCount}/{approvers}
                </Table.Cell>
                <Table.Cell>{complete ? "yes" : "no"}</Table.Cell>
                <Table.Cell>
                  {!complete && (
                    <>
                      <Button
                        color="green"
                        onClick={() => onApprove(i)}
                        disabled={isApproveLoading.get(i)}
                        loading={isApproveLoading.get(i)}
                      >
                        Approve
                      </Button>
                      <Button
                        color="teal"
                        onClick={() => onFinalize(i)}
                        disabled={isFinalizeLoading.get(i)}
                        loading={isFinalizeLoading.get(i)}
                      >
                        Finalize
                      </Button>
                    </>
                  )}
                </Table.Cell>
              </Table.Row>
            )
          )}
        </Table.Body>
      </Table>
      <Link href={`/campaigns/${address}/requests/new`}>
        <a>
          <Button primary>Create request</Button>
        </a>
      </Link>
    </>
  );
}

export async function getStaticPaths() {
  const campaigns = await factory.methods.getAllCampaigns().call();

  return {
    paths: campaigns.map((c) => ({ params: { address: c } })),
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const campaign = getCampaignInstance(context.params.address);
  const approvers = await campaign.methods.approversCount().call();
  const requestsAmount = await campaign.methods.numRequests().call();
  const requests = (
    await Promise.all(
      Array(+requestsAmount)
        .fill()
        .map((_, i) => campaign.methods.requests(i).call())
    )
  ).map(({ description, value, recipient, complete, approvalCount }, i) => ({
    id: `requests-${context.params.address}-${i}`,
    description,
    value,
    recipient,
    complete,
    approvalCount,
  }));

  return {
    props: {
      requests: requests,
      approvers,
    },
  };
}
