import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Forum as ForumIcon,
} from "@mui/icons-material";
import { groupService } from "../services/api";
import "./Dashboard.css";

const Forum = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!groupId) {
        setShouldRedirect(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Ellenőrizzük, hogy a felhasználó tagja-e a csoportnak
        const response = await groupService.myGroups();
        const foundGroup = response.groups?.find(
          (g) => g.id === parseInt(groupId)
        );

        if (foundGroup) {
          // Csak akkor állítjuk be a csoportot, ha tagja vagyunk
          setGroup(foundGroup);
        } else {
          // Ha nem található a saját csoportok között, nincs hozzáférés
          // Azonnal visszairányítjuk a dashboard-ra
          setShouldRedirect(true);
        }
      } catch (err) {
        console.error("Csoport betöltési hiba:", err);
        // Hiba esetén is azonnal visszairányítjuk
        setShouldRedirect(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  // Ha nincs hozzáférés, azonnal redirect
  if (shouldRedirect) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Ha nincs csoport vagy hiba van, akkor redirect
  if (error || !group) {
    return <Navigate to="/dashboard" replace />;
  }

  // Biztosítjuk, hogy a group létezik
  if (!group) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div
      className="dashboard-container"
      style={{
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#f5f7fa",
      }}
    >
      <Box sx={{ maxWidth: "1200px", mx: "auto", p: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 4,
          }}
        >
          <IconButton
            onClick={() => navigate("/dashboard")}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #5568d3 0%, #6a3d8f 100%)",
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box flex={1}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {group?.name || "Forum"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {group?.subject || "Csoport forum"}
            </Typography>
          </Box>
        </Box>

        {/* Placeholder Content */}
        <Card
          sx={{
            borderRadius: "20px",
            border: "1px solid rgba(102, 126, 234, 0.2)",
            boxShadow: "0 4px 20px rgba(102, 126, 234, 0.1)",
            backgroundColor: "white",
          }}
        >
          <CardContent sx={{ p: 4, textAlign: "center" }}>
            <ForumIcon
              sx={{
                fontSize: 80,
                color: "#667eea",
                mb: 2,
              }}
            />
            <Typography
              variant="h5"
              sx={{ mb: 2, fontWeight: 600, color: "#333" }}
            >
              Forum felület
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Ez a forum oldal jelenleg fejlesztés alatt áll.
              <br />
              Itt lesz látható a csoport forum tartalma, bejegyzések és
              hozzászólások.
            </Typography>
            {group && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  <strong>Csoport neve:</strong> {group.name}
                </Typography>
                {group.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    <strong>Leírás:</strong> {group.description}
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  <strong>Tárgy:</strong> {group.subject}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default Forum;
