

import { motion } from "framer-motion";
import React from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useState } from 'react';

interface Difficulty {
  name: string
  selected: boolean
}

let Difficulties: Difficulty[] = [
  {name: "No AI", selected: true},
  {name: "Easy AI", selected: false},
  {name: "Medium AI", selected: false},
  {name: "Hard AI", selected: false}
]
export function AI_Selector() {
  const [selectedDifficulty, setSelectedDifficulty] = useState("No AI")
  return (
    <Stack spacing={2} direction="row">
      {
        Difficulties.map((difficulty) => 
        <Button 
        variant={(difficulty.name == selectedDifficulty) ? "contained" : "outlined"}
        onClick={(event) => setSelectedDifficulty(difficulty.name)}
        >{difficulty.name}
        </Button>
      )
      }
    </Stack>
  );
}
