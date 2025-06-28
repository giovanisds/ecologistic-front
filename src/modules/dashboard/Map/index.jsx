import {
  Box,
  Typography,
  CircularProgress,
  Popover,
  TextField,
  Button,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";

import { useGetPoints, useSavePoint } from "../../../services/dashboard";
import { useForm } from "react-hook-form";
import { useGlobalKeys } from "../../../stores/useGlobalKeys";

const MapComponent = () => {
  const divRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [infoAnchorEl, setInfoAnchorEl] = useState(null);
  const [selected, setSelected] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const userName = useGlobalKeys((state) => state.userName);
  const userKey = useGlobalKeys((state) => state.userKey);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_KEY;

  const { isLoaded = false } = useJsApiLoader({
    googleMapsApiKey,
  });

  const {
    data: points = [],
    refetch,
    isPending: isLoading,
  } = useGetPoints(userKey);
  const [data, setData] = useState(points);

  const { mutate, isPending } = useSavePoint();

  const handleMapClick = useCallback(
    (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const newPoint = {
        lat,
        lng,
        pixel: event.pixel,
        id: data.length + 1,
        name: "",
        desc: "",
      };

      setAnchorEl(divRef);
      setSelected(newPoint);
      setData((prev) => [...prev, newPoint]);
    },
    [data]
  );

  const handleClickPointer = useCallback((event, it) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newPoint = {
      lat,
      lng,
      pixel: {
        x: event.domEvent.clientX,
        y: event.domEvent.clientY,
      },
      name: it.nome,
      desc: it.descricao,
    };

    console.log(newPoint);

    setInfoAnchorEl(divRef);
    setSelected(newPoint);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    setAnchorEl(null);
    setData((prev) => prev.slice(0, prev.length - 1));
    setTimeout(() => setSelected(undefined), 500);
  }, [reset]);

  const onSubmit = (values) => {
    mutate(
      {
        userId: userKey,
        descricao: values.desc,
        nome: values.name,
        lat: selected.lat,
        lng: selected.lng,
      },
      {
        onError: () => {
          setSnackbarMessage("Erro ao salvar ponto. Tente novamente.");
          setSnackbarOpen(true);
        },
        onSuccess: () => {
          setAnchorEl(null);
          reset();
          refetch();
        },
      }
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("credentials");
    window.location.reload();
  };

  useEffect(() => {
    setData(points);
  }, [points]);

  if (!isLoaded || isLoading) {
    return (
      <Box
        width={1}
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box width={1} height="100vh">
      <Popover
        open={!!infoAnchorEl}
        anchorEl={infoAnchorEl}
        onClose={() => setInfoAnchorEl(null)}
        anchorReference="anchorPosition"
        anchorPosition={{
          top: Number(selected?.pixel?.y) - 160,
          left: Number(selected?.pixel?.x) - 160,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          p={2}
          gap={2}
          width={320}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Detalhes do ponto
          </Typography>
          <TextField disabled fullWidth value={selected?.name} label="Nome" />
          {selected?.desc && (
            <TextField
              disabled
              fullWidth
              label="Descrição"
              value={selected?.desc}
            />
          )}
        </Box>
      </Popover>

      {/* Formulário de novo ponto */}
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{
          top: Number(selected?.pixel?.y) - 300,
          left: Number(selected?.pixel?.x) - 160,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            display="flex"
            alignItems="center"
            flexDirection="column"
            p={2}
            gap={2}
            width={320}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Adicionar novo ponto
            </Typography>
            <TextField
              {...register("name", { required: "Campo obrigatório" })}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              label="Nome"
            />
            <TextField {...register("desc")} fullWidth label="Descrição" />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isPending}
              fullWidth
            >
              {isPending ? "Salvando..." : "Salvar ponto"}
            </Button>
          </Box>
        </form>
      </Popover>

      {/* Mapa */}
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={{ lat: -28.26, lng: -52.4 }}
        zoom={13}
        onClick={handleMapClick}
      >
        {data.map((it) => {
          const isSelected =
            it.lng === selected?.lng && it.lat === selected?.lat;

          return (
            <Marker
              key={it.id}
              onClick={(ev) => handleClickPointer(ev, it)}
              position={{ lat: it.lat, lng: it.lng }}
              ref={isSelected ? divRef : undefined}
            />
          );
        })}
      </GoogleMap>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="error"
          onClose={() => setSnackbarOpen(false)}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Box
        width={1}
        display={"flex"}
        position={"absolute"}
        justifyContent={"center"}
        top={24}
      >
        <Box
          paddingX={4}
          height={60}
          bgcolor={"white"}
          display={"flex"}
          gap={0.5}
          alignItems={"center"}
          justifyContent={"center"}
          borderRadius={12}
        >
          <Typography variant="h6" sx={{ marginRight: 2 }}>
            {userName}
          </Typography>

          <IconButton
            variant="contained"
            color="primary"
            onClick={handleLogout}
          >
            <ExitToAppIcon color="white" size="large" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MapComponent;
