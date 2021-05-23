 9DaysOld
    'Peas' token
      ✓ is called 'Peas'.
      ✓ has a 'PEAS' symbol.
      ✓ is correctly decimated.
      ✓ was pre-minted.
      ✓ can be minted.
      ✓ can be burned.
    'Porridge' token
      ✓ is called 'Porridge'.
      ✓ has a 'PORR' symbol
      ✓ is correctly decimated.
      ✓ wasn't pre-minted.
      ✓ can be minted by the licensed address.
      ✓ cannot be minted by an unlicensed address.
      ✓ can be burned.
      ✓ can transfer 'Porridge' to a given address and produce a correct reciept
      ✓ can transfer 'Porridge' to a given address and the given address receives the funds.
      ✓ can transfer 'Porridge' to a given address and the senders funds are reduced.
    Swapping Wrapper
      Can swap 'Hot' for 'Porridge'.
        ✓ emits event when swapping.
        ✓ mints 'Porridge' from 'Hot'.
        ✓ burns 'Hot' while minting 'Porridge'.
        ✓ won't underrun 'Hot' to mint 'Porridge'.
      Can swap 'Cold' for 'Porridge'.
        ✓ emits event when swapping.
        ✓ mints 'Porridge' from 'Cold'.
        ✓ burns 'Cold' while minting 'Porridge'.
        ✓ won't underrun 'Cold' to mint 'Porridge'.
      Can un-swap 'Porridge' for 'Hot'.
        ✓ emits event when unswapping.
        ✓ mints 'Hot' from 'Porridge'.
        ✓ burns 'Porridge' while minting 'Hot'.
        ✓ won't underrun 'Porridge' to mint 'Hot'.
      Can un-swap 'Porridge' for 'Cold'.
        ✓ emits event when unswapping.
        ✓ mints 'Cold' from 'Porridge'.
        ✓ burns 'Porridge' while minting 'Cold'.
        ✓ won't underrun 'Porridge' to mint 'Cold'.