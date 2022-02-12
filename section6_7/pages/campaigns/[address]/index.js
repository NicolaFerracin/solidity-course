import { useRouter } from "next/router";
import { Card, Grid, Button } from "semantic-ui-react";
import Link from "next/link";
import ContributeForm from "../../../components/contributeForm";
import web3 from "../../../eth/web3";
import factory from "../../../eth/factory";
import getCampaignInstance from "../../../eth/campaign";

export default function Campaign({
  minContribution,
  balance,
  requests,
  approvers,
  manager,
}) {
  const router = useRouter();
  const { address } = router.query;

  const items = [
    {
      header: manager,
      description:
        "The creator and manager of the campaign. The only address that can create and finalize requests.",
      meta: "Manager",
      style: { overflowWrap: "break-word" },
    },
    {
      header: `${minContribution} wei`,
      description:
        "The minimum amount of Wei you need to send to contribute to the campaign.",
      meta: "Minimum Contribution (Wei)",
    },
    {
      header: requests,
      description: "Amount of requests pending approval for spending money.",
      meta: "Number of Requests",
    },
    {
      header: approvers,
      description:
        "Amount of addresses that contributed the minimum amount and hold voting powers over any request.",
      meta: "Number of Contributors",
    },
    {
      header: `${web3.utils.fromWei(balance, "ether")} ether`,
      description: "Balance left for spending on the campaign contract.",
      meta: "Campaign Balance (ether)",
    },
  ];

  return (
    <>
      <h2>Campaign</h2>
      <h4>{address}</h4>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={items} />
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm campaignAddr={address} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${address}/requests`}>
              <a>
                <Button primary>View requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
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

  const minContribution = await campaign.methods.minContribution().call();
  const balance = await web3.eth.getBalance(context.params.address);
  const requests = await campaign.methods.numRequests().call();
  const approvers = await campaign.methods.approversCount().call();
  const manager = await campaign.methods.manager().call();

  return {
    props: {
      minContribution,
      balance,
      requests,
      approvers,
      manager,
    },
  };
}
