import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { Form, Button, Message, Input } from "semantic-ui-react";
import web3 from "../../../../eth/web3";
import getCampaignInstance from "../../../../eth/campaign";

export default function Requests() {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    recipient: "",
  });
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { address } = router.query;

  const handleChange = useCallback((e) => {
    e.preventDefault();
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  });

  const onSubmit = useCallback(async (e) => {
    setError("");
    setIsLoading(true);
    e.preventDefault();

    // 0x9a9292D99C7813e963097dE12E848CaeF78eECAa 0.299519904997856666
    const campaign = getCampaignInstance(address);
    const { description, amount, recipient } = form;

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(
          description,
          web3.utils.toWei(amount, "ether"),
          recipient
        )
        .send({ from: accounts[0] });
      router.push(`/campaigns/${address}/requests`);
    } catch (e) {
      setError(e);
    }
    setIsLoading(false);
  });

  return (
    <>
      <h2>Create Request</h2>{" "}
      {error && (
        <Message negative>
          <Message.Header>Something went wrong</Message.Header>
          <p>{JSON.stringify(error.message)}</p>
        </Message>
      )}
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={form.description}
            onChange={handleChange}
            name="description"
          />
        </Form.Field>
        <Form.Field>
          <label>Amount</label>
          <Input
            value={form.amount}
            onChange={handleChange}
            name="amount"
            label={"ether"}
            labelPosition="right"
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            value={form.recipient}
            onChange={handleChange}
            name="recipient"
          />
        </Form.Field>
        <Button primary disabled={isLoading} loading={isLoading}>
          Create Request
        </Button>
      </Form>
    </>
  );
}
