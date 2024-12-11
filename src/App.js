import { useEffect, useState } from "react";

export default function App() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function AddAmount(e) {
    if (!isNaN(e.target.value) && e.target.value.trim() !== "") {
      setAmount(+e.target.value);
    } else {
      setAmount("");
    }
  }

  useEffect(
    function () {

      async function getConvertedAmount() {
        try {
          setLoading(true);
          setError("");
          const res = await fetch(
            `https://api.frankfurter.dev/v1/latest?amount=${amount}base=${from}&symbols=${to}`
          );
          if (res.ok !== true) throw new Error("Connection Problem");
          const data = await res.json();
          setExchangeRate(data.rates[to]);
          setLoading(false);
        } catch (err) {
          setError(err.message);
        }
      }

      if (from === to) {
        setExchangeRate(amount);
      } else if (!amount) {
        return;
      } else {
        getConvertedAmount();
      }
    },
    [from, to, amount, setLoading]
  );

  return (
    <>
      <input
        disabled={loading}
        value={amount}
        onChange={AddAmount}
        type="text"
        placeholder="Enter Amount Here"
      />
      <select
        disabled={loading}
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>

      <select
        disabled={loading}
        value={to}
        onChange={(e) => setTo(e.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>

      {!error && (
        <p>
          {exchangeRate} {to}
        </p>
      )}
      {error && <Error error={error} />}
    </>
  );
}

function Error({ error }) {
  return <p className="error">{error}</p>;
}
