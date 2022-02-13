import { Card, Button, Message } from "semantic-ui-react";
import Link from "next/link";
import factory from "../eth/factory";

function Index({ campaigns }) {
  const items = campaigns.map((c) => ({
    header: c,
    description: (
      <Link href={`/campaigns/${c}`}>
        <a>View campaign</a>
      </Link>
    ),
    fluid: true,
  }));

  return (
    <>
      <h2>Open Campaigns</h2>
      <Message positive>
        <Message.Header>Welcome!</Message.Header>
        <p>
          This is a web3 app built during the "
          <a
            target="_blank"
            href="https://udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/"
          >
            Ethereum and Solidity: The Complete Developer's Guide
          </a>
          " udemy course.
        </p>
        <p>
          It's a blockchain implementation of Kickstarter, deployed on the
          ropsten network.
        </p>
        <p>
          Main contract address:{" "}
          <code>0xcA022819c7B3eB10F270a11B1C064CE15Ea47EE9</code>.
        </p>
        <p>
          Main features:
          <ul>
            <li>
              Any address can create a campaign and they'll be their manager
            </li>
            <li>
              Any address can contribute the minum requirement amount to any
              campaign, becoming then a verified approver
            </li>
            <li>
              The manager can create spending requests, which will then have to
              be approved by at least half the verified approvers
            </li>
            <li>
              Verified approvers can accept spending requests created by the
              manager
            </li>
            <li>
              Once the minimum amount of approvers accepted a given request, the
              manager can finalize said request processing the payment and
              sending funds from the campaign to the selected recipient
            </li>
          </ul>
        </p>
        <p>
          Example use case:
          <ul>
            <li>
              Address 0x123 create a campaign to collect funds for writing a
              novel, with a minimum contribution of 0.5 ETH
            </li>
            <li>
              0xabc, 0x456 and 0x999 contribute 1 ETH each to the campaign. The
              campaign has now a balance of 3 ETH
            </li>
            <li>
              The manager (0x123) creates a spending request for sending 2 ETH
              to the printing company address (0xpR1nt)
            </li>
            <li>
              0xabc approves the request. The manager cannot finalize the
              request as there are only 1/3 approvals
            </li>
            <li>0x456 approves the request as well</li>
            <li>
              We reached a quorum of at least half the approvals. The manager
              (0x123) can finalize the request and 2 ETH will be sent to the
              printing company address (0xpR1nt)
            </li>
            <li>The final balance on the campaign address is 1 ETH</li>
          </ul>
        </p>
      </Message>
      <Link href="/campaigns/new">
        <a>
          <Button primary floated="right">
            New campaign
          </Button>
        </a>
      </Link>
      <Card.Group items={items} />
    </>
  );
}

export async function getStaticProps() {
  const campaigns = await factory.methods.getAllCampaigns().call();

  return {
    props: { campaigns },
  };
}

export default Index;
