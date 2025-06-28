import { ChevronLeft } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";

const Wrapper = ({ children, text, handleBack }) => {
  return (
    <Box
      width={1}
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      paddingX={3}
    >
      <Box
        gap={3}
        maxWidth={450}
        width={1}
        display="flex"
        position="relative"
        flexDirection="column"
      >
        {!!handleBack && (
          <Box display={"flex"} top={32} position={"absolute"}>
            <IconButton size="small" onClick={handleBack}>
              <ChevronLeft fontSize="large" />
            </IconButton>
          </Box>
        )}
        <Box minHeight={300}>
          <img src="./logo.webp" alt="logo atitus maps" />
        </Box>
        <Typography variant="h4" fontWeight={"bold"}>
          {text}
        </Typography>
        {children}
      </Box>
    </Box>
  );
};

export default Wrapper;
