"use client";
import { NextPage } from "next";

interface Props {}
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/stores/hookStore";
import Box from "@mui/material/Box";
import { Padding, TextFields } from "@mui/icons-material";

const Page: NextPage<Props> = ({}) => {
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [name, setName] = useState("");

  var ranonce = false;
  const [loading, setLoading] = useState(true);
  const masterStore = useAppSelector((state) => state.master);
  useEffect(() => {
    if (!ranonce) {
      if (masterStore.isAdmin) {
        setLoading(false);
      }
      ranonce = true;
    }
  }, []);

  const validateInputs = () => {
    const name = document.getElementById("name") as HTMLInputElement;

    let isValid = true;

    if (!name.value) {
      setNameError(true);
      setNameErrorMessage("Please enter category name.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  const handleSave = () => {
    const valid: boolean = validateInputs();

    if (valid) {
    }
  };

  const renderPage = () => {
    if (!loading) {
      return (
        <React.StrictMode>
          <div className="flex w-80">
            <div className="flex-auto w-60 ">
              <Card sx={{}}>
                <form
                  className="p-10  border-radius-5"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="flex">
                    <FormControl>
                      <div className="flex-none w-80">
                        <TextField
                          value={name}
                          onChange={(val) => {
                            setName(val.target.value);
                          }}
                          error={nameError}
                          helperText={nameErrorMessage}
                          id="name"
                          type="text"
                          label="Category name"
                          size="small"
                          name="name"
                          placeholder="Category name..."
                          autoFocus
                          fullWidth
                          variant="outlined"
                          color={nameError ? "error" : "primary"}
                          sx={{ ariaLabel: "email" }}
                        />
                      </div>
                    </FormControl>
                  </div>
                  <div className="flex-none w-20">
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      onClick={() => handleSave()}
                    >
                      Sign in
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </React.StrictMode>
      );
    }
  };

  return renderPage();
};

export default Page;
