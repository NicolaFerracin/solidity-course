import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { Button, Form, Input, Message } from "semantic-ui-react";
import web3 from "../../eth/web3";
import factory from "../../eth/factory";

function NewCampaign() {
  const router = useRouter();
  const [minContribution, setMinContribution] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    setMinContribution(e.target.value);
  });

  const onSubmit = useCallback(async (e) => {
    setError("");
    setIsLoading(true);
    e.preventDefault();

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minContribution).send({
        from: accounts[0],
      });
      router.push("/");
    } catch (e) {
      setError(e);
    }
    setIsLoading(false);
  });

  return (
    <>
      <h1>New campaign</h1>
      {error && (
        <Message negative>
          <Message.Header>Something went wrong</Message.Header>
          <p>{JSON.stringify(error.message)}</p>
        </Message>
      )}
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            value={minContribution}
            onChange={handleChange}
            label={"wei"}
            labelPosition="right"
          />
        </Form.Field>
        <Button disabled={isLoading} loading={isLoading} primary>
          Create
        </Button>
      </Form>
    </>
  );
}

export default NewCampaign;
