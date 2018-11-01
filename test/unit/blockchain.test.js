import { sha256 } from '../../src/helpers';

test('Merkle root is calculated correctly', async () => {
  // setup
  let block = new Block()
  block.addTransaction({
    sender: "Didrik",
    receiver: "Emilie",
    type: "transfer",
    amount: 100,
  })

  block.addTransaction({
    sender: "Philip",
    receiver: "Didrik",
    type: "transfer",
    amount: 670,
  })

  block.addTransaction({
    sender: "Harald",
    receiver: "Didrik",
    type: "transfer",
    amount: 1000,
  })

  // correct txRoot
  const hash0 = await sha256(block.transactions[0]);
  const hash1 = await sha256(block.transactions[1]);
  const hash2 = await sha256(block.transactions[2]);

  const hash01 = await sha256(hash0+hash1);
  const hash22 = await sha256(hash2+hash2);

  const correctTxRoot = await sha256(hash01+hash22);
  const txRoot = await block.calculateMerkleRoot();

  // assertions
  expect(txRoot).toEqual(correctTxRoot);

})



