import { useState, useCallback } from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";
import web3 from "../eth/web3";
import getCampaignInstance from "../eth/campaign";

export default function ContributeForm({ campaignAddr }) {
  const [contribution, setContribution] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    setContribution(e.target.value);
  });

  const onSubmit = useCallback(async (e) => {
    setError("");
    setIsLoading(true);
    e.preventDefault();

    try {
      const campaign = getCampaignInstance(campaignAddr);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        value: contribution,
        from: accounts[0],
      });
      window.location.reload();
    } catch (e) {
      setError(e);
    }
    setIsLoading(false);
  });

  return (
    <>
      <h2>Contribute to the Campaign</h2>
      {error && (
        <Message negative>
          <Message.Header>Something went wrong</Message.Header>
          <p>{JSON.stringify(error.message)}</p>
        </Message>
      )}
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Amount to contribute</label>
          <Input
            value={contribution}
            onChange={handleChange}
            label={"wei"}
            labelPosition="right"
          />
        </Form.Field>
        <Button disabled={isLoading} loading={isLoading} primary>
          Contribute
        </Button>
      </Form>
    </>
  );
}
