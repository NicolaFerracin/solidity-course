import { Card, Button } from "semantic-ui-react";
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
      <>
        <Link href="/campaigns/new">
          <a>
            <Button primary floated="right">
              New campaign
            </Button>
          </a>
        </Link>
        <Card.Group items={items} />
      </>
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
