import React, { useEffect, useState } from "react";
import {
  FileInput,
  SimpleForm,
  useNotify,
  TextInput,
  SaveButton,
} from "react-admin";
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  Tooltip,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import WebcamCapture from "./Webcam";
import ProductGrid from "../Product/ProductGrid";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

export const Search = () => {
  const [products, setProducts] = useState([]);
  const { formState } = useForm();
  const notify = useNotify();
  const [file, setFile] = useState<any>();
  const [preview, setPreview] = useState<string>();
  const [searchDescription, setSearchDescription] = useState<string | null>();
  const [camera, setCamera] = useState(false);

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!file) {
      setPreview(undefined);
      return;
    }

    const objectUrl: string = URL.createObjectURL(file);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const onChangeHandler = (event: any) => {
    setFile(event);
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file); //data.file.rawFile);
        notify("Searching with images can be slow. Wait until it finishes...", {
          type: "info",
        });
      }
      formData.append(
        "post",
        JSON.stringify({
          query: data.query,
          n: data.n || 20,
        })
      );

      const res = await fetch(`/api/search`, {
        method: "POST",
        body: formData,
      });

      const response = await res.json();
      setProducts(response.data);
      if (response.promptDescription)
        setSearchDescription(response.promptDescription);
      else setSearchDescription(null);
    } catch (error) {
      console.error("Error running search:", error);
      notify("Error running search", { type: "error" });
    }
  };

  const clearImage = async () => {
    // Do something with the captured image (e.g., set it in state)
    setFile(null);
  };

  const handleWebcamCapture = async (imageSrc: string) => {
    // Do something with the captured image (e.g., set it in state)
    const blob = await fetch(imageSrc).then((res) => res.blob());
    setFile(blob);
    setCamera(!camera);
  };

  return (
    <Card>
      <CardHeader title="Product Search powered by Generative AI" />
      <CardContent>
        <WebCamDialog
          onCapture={handleWebcamCapture}
          open={camera}
          setCamera={() => setCamera(!camera)}
        />
        <SimpleForm onSubmit={onSubmit} toolbar={false}>
          <Grid container alignItems="center" justifyContent="center">
            {file && (
              <Grid item xs={12} md={3} ml="0.6em" direction="row">
                <>
                  <img src={preview} width="200" height={200} />
                  <Button
                    variant="outlined"
                    onClick={() => clearImage()}
                    disabled={formState.isSubmitting}
                  >
                    Remove
                  </Button>
                </>
              </Grid>
            )}

            {!file && (
              <>
                <Grid item xs={12} md={2} ml="0.5em" direction="row">
                  <FileInput
                    variant="outlined"
                    source="file"
                    name="file"
                    label="Send a picture"
                    accept="image/*"
                    onChange={onChangeHandler}
                  />
                </Grid>
                <Grid item xs={12} md={2} ml="0.5em" mb="0.5em" direction="row">
                  <Button
                    variant="outlined"
                    onClick={() => setCamera(!camera)}
                    fullWidth
                  >
                    or take a picture
                  </Button>
                </Grid>
              </>
            )}

            <Grid item xs={12} md={3} ml="0.5em">
              <TextInput
                source="query"
                label="What are you looking for?"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md="auto" ml="0.5em">
              <SaveButton label="Search" disabled={formState.isSubmitting} />
            </Grid>
          </Grid>
        </SimpleForm>
        {searchDescription && (
          <div>
            <Tooltip title="If an image is provided, a description is asked to the model to enrich the prompt and search">
              <AutoFixHighIcon color="primary" />
            </Tooltip>
            <b>Your Search:</b> {searchDescription}
          </div>
        )}
        {products && products.length > 0 && <ProductGrid data={products} />}
      </CardContent>
    </Card>
  );
};

function WebCamDialog(props: {
  open: boolean;
  setCamera: (x: boolean) => void;
  onCapture: (imageSrc: string) => Promise<void>;
}) {
  return (
    <Dialog fullScreen open={props.open} onClose={() => props.setCamera(false)}>
      <WebcamCapture onCapture={props.onCapture} />
    </Dialog>
  );
}
