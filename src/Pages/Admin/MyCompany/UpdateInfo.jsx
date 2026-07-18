import {
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import api from "../../../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Chip,
  Box,
  Button,
} from "@mui/material";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../../Components/Common/Buttons";

const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

const setNestedValue = (obj, path, value) => {
  const keys = path.split(".");
  const newObj = { ...obj };

  let current = newObj;

  for (let i = 0; i < keys.length - 1; i++) {
    current[keys[i]] = { ...current[keys[i]] };
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;

  return newObj;
};

export function RenderField({ field, data, setData }) {
  const value = getNestedValue(data, field.key);

  const handleChange = (newValue) => {
    setData((prev) => setNestedValue(prev, field.key, newValue));
  };

  switch (field.type) {
    case "textarea":
      return (
        <TextField
          fullWidth
          multiline
          rows={4}
          label={field.label}
          value={value || ""}
          required={field.required}
          onChange={(e) => handleChange(e.target.value)}
        />
      );

    case "email":
      return (
        <TextField
          fullWidth
          type="email"
          label={field.label}
          value={value || ""}
          required={field.required}
          onChange={(e) => handleChange(e.target.value)}
        />
      );

    case "number":
      return (
        <TextField
          fullWidth
          type="number"
          label={field.label}
          value={value || ""}
          onChange={(e) => handleChange(e.target.value)}
        />
      );

    case "date":
      return (
        <TextField
          fullWidth
          type="date"
          label={field.label}
          InputLabelProps={{
            shrink: true,
          }}
          value={value || ""}
          onChange={(e) => handleChange(e.target.value)}
        />
      );

    case "select":
      return (
        <FormControl fullWidth>
          <InputLabel>{field.label}</InputLabel>

          <Select
            value={value || ""}
            label={field.label}
            onChange={(e) => handleChange(e.target.value)}
          >
            {field.options?.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );

    case "array":
      return (
        <Box>
          {/* <Stack direction="row" spacing={1} mb={2}>
            {(value || []).map((item, index) => (
              <Chip
                key={index}
                label={item}
                onDelete={() => {
                  handleChange(value.filter((_, i) => i !== index));
                }}
                sx={{
                  bgcolor: "#3E1A89",
                  color: "#fff",
                  borderColor: "#3E1A89",
                  "& .MuiChip-deleteIcon": {
                    color: "#f4f4f4",
                  },
                }}
              />
            ))}
          </Stack> */}

          <Box>
            <Stack
              direction={{ xs: "column", md: "row" }}
              flexWrap="wrap"
              gap={2}
            >
              {/* {(value || []).map((item, index) => (
                <TextField
                  fullWidth
                  value={item}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
          size="small"
          onClick={() => {
            const updated = value.filter((_, i) => i !== index);
            handleChange(updated);
          }}>
                            <CloseIcon color="error" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              ))} */}
              {(data.certification || []).map((item, index) => (
  <Box
    key={index}
    sx={{
      mb: 2,
      p: 2,
      border: "1px solid #eee",
      borderRadius: 2,
      bgcolor: "#fafafa",
    }}
  >
    <TextField
      fullWidth
      size="small"
      label={`Certification ${index + 1}`}
      value={item?.value || ""}  
      onChange={(e) => {
        const updated = [...(data.certification || [])];

        updated[index] = {
          ...updated[index],
          value: e.target.value,
        };

        setData((prev) => ({
          ...prev,
          certification: updated,
        }));
      }}
    />

    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
      <IconButton
        color="error"
        onClick={() => {
          setData((prev) => ({
            ...prev,
            certification: prev.certification.filter(
              (_, i) => i !== index
            ),
          }));
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  </Box>
))}

              <Button
  onClick={() => {
    setData((prev) => ({
      ...prev,
      certification: [
        ...(prev.certification || []),
        { value: "" },
      ],
    }));
  }}
>
  + Add
</Button>
            </Stack>
          </Box>
          {/* <Button
            variant="outlined"
            onClick={() => {
              const newItem = prompt(`Add ${field.label}`);

              if (newItem) {
                handleChange([...(value || []), newItem]);
              }
            }}
          >
            Add {field.label}
          </Button> */}
        </Box>
      );

    case "image":
      console.log(value);

      return (
        <Stack>
          <Button variant="outlined" component="label">
            Upload Image
            <input
              hidden
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  handleChange({
                    file,
                    preview: URL.createObjectURL(file),
                  });
                }
              }}
            />
          </Button>

          {value && (
            <Box
              mt={3}
              sx={{
                height: 150,
                width: 150,
                position: "relative",
                display: "inline-block",
              }}
            >
              <img
                src={value?.preview || value}
                alt="Preview"
                width={150}
                height={150}
                style={{
                  mt: 1,
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />

              <IconButton
                size="small"
                onClick={() => handleChange(null)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.8)",
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Stack>
      );

    default:
      return (
        <TextField
          fullWidth
          label={field.label}
          value={value || ""}
          required={field.required}
          onChange={(e) => handleChange(e.target.value)}
        />
      );
  }
}

export default function UpdateInfo() {
  const [profileSchema, setProfileSchema] = useState([
    {
      section: "Company Information",
      fields: [
        {
          key: "companyName",
          label: "Company Name",
          type: "text",
          required: true,
        },
        {
          key: "companyDescription",
          label: "Company Description",
          type: "textarea",
          required: true,
        },
        {
          key: "companyImage",
          label: "Company Logo",
          type: "image",
        },
        {
          key: "founder",
          label: "Founder",
          type: "text",
        },
      ],
    },

    {
      section: "Contact Information",
      fields: [
        {
          key: "email",
          label: "Email",
          type: "email",
        },
        {
          key: "phone",
          label: "Phone",
          type: "phone",
        },
        {
          key: "licence",
          label: "License Number",
          type: "text",
        },
      ],
    },

    {
      section: "Cerifications",
      fields: [
        {
          key: "certification",
          label: "Certifications",
          type: "array",
        },
      ],
    },
  ]);

  const [openAddField, setOpenAddField] = useState(false);
  const [newField, setNewField] = useState({
    label: "",
    key: "",
    type: "text",
    section: "",
    required: false,
  });

  const handleAddField = () => {
    addFieldToSection(newField.section, newField);

    setOpenAddField(false);
  };

  const [companyData, setCompanyData] = useState({
    companyName: "",
    companyDescription: "",
    companyImage: "",
    founder: "",
    email: "",
    phone: "",
    licence: "",

    socialMedia: {
      instagram: "",
      facebook: "",
      twitter: "",
      youtube: "",
    },

    certification: [],

    customFields: [],
  });

const [loading, setLoading] = useState(false);
const [openDelete, setOpenDelete] = useState(false);

  const { id } = useParams();
  const [socials, setSocials] = useState([]);
  const navigate = useNavigate();

  const [customFields, setCustomFields]= useState([]);

  const addFieldToSection = (sectionName, field) => {
    setProfileSchema((prev) =>
      prev.map((section) =>
        section.section === sectionName
          ? {
              ...section,
              fields: [...section.fields, field],
            }
          : section,
      ),
    );
  };

  const getFields = async () => {
    try {
      let res = await api.get("/company/get");
      let cD = res.data.data;
      const fetchedCustomFields = cD?.customFields
        ? Object.entries(cD.customFields).map(([key, value]) => ({ key, value }))
        : [];
      setCustomFields(fetchedCustomFields);

      const fetchedSocials = cD?.socialMedia ?? [];
      setSocials(fetchedSocials);

      setCompanyData({
        companyName: cD?.companyName,
        companyDescription: cD?.companyDescription,
        companyImage: cD?.companyImage,
        founder: cD?.founder,
        email: cD?.email,
        phone: cD?.phone,
        licence: cD?.licence,
        certification: (cD?.certification || []).map((item) => ({
  value: item,
})),
        customFields: fetchedCustomFields,
      });
    } catch (error) {
      enqueueSnackbar("Server Crashed We Will Comeback Soon !!", {
        variant: "error",
      });
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
formData.append("companyName", companyData.companyName || "");
    formData.append(
      "companyDescription",
      companyData.companyDescription || ""
    );
    formData.append("founder", companyData.founder || "");
    formData.append("email", companyData.email || "");
    formData.append("phone", companyData.phone || "");
    formData.append("licence", companyData.licence || "");

    if (companyData.companyImage?.file) {
      formData.append(
        "companyImage",
        companyData.companyImage.file
      );
    }

    formData.append("socialMedia", JSON.stringify(socials));

    formData.append(
  "certification",
  JSON.stringify(
    (companyData.certification || []).map((item) => item.value)
  )
);

    const formattedCustomFields = (customFields || []).reduce((acc, item) => {
      if (item.key?.trim()) {
        acc[item.key] = item.value;
      }
      return acc;
    }, {});

    formData.append("customFields", JSON.stringify(formattedCustomFields));
    formData.forEach((value, key) => {
      console.log(key, value);
    })
      let res;

      if (id === "add") {
        res = await api.post("/company/add", formData);
      } else {
        res = await api.put(`/company/update/${id}`, formData);
      }

      enqueueSnackbar(res.data.message, {
        variant: "success",
      });
      navigate("/admin/info");
    } catch (error) {
      console.log(error.response.data.message);
      
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if(id != "add"){
      getFields();
    }
  }, []);

  return (
    <Box sx={{ position: "relative" }}>
      <SecondaryButton
        sx={{ position: { xs: "relative" }, top: -9, left: -2 }}
        onClick={() => navigate("/admin/info")}
      >
        ←Back
      </SecondaryButton>
      <Typography variant="h5" color="initial" align="center">
        Update Info
      </Typography>

      <SnackbarProvider />
      <Box component="form" noValidate onSubmit={handlePost}>
        {profileSchema.map((section) => (
          <Paper
            elevation={0}
            key={section.section}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 4,
            }}
          >
            <Typography variant="h6" fontWeight={700} color="#3E1A89" mb={3}>
              {section.section}
            </Typography>

            <Grid container spacing={2}>
              {section.fields.map((field) => (
                <Grid key={field.key} size={{ xs: 12, md: 6 }}>
                  <RenderField
                    field={field}
                    data={companyData}
                    setData={setCompanyData}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        ))}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 4,
          }}
        >
          <Typography variant="h6" fontWeight={700} color="#3E1A89" mb={3}>
            Social Media
          </Typography>
          <Stack spacing={2} mt={2}>
            {socials.map((social, index) => (
              <Box key={index} display="flex" gap={2} sx={{ mb: 1, alignItems: 'center' }}>
                <TextField
                  label="Platform"
                  value={social.platform}
                  onChange={(e) => {
                    const updated = [...socials];
                    updated[index].platform = e.target.value;
                    setSocials(updated);
                  }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="URL"
                  value={social.url}
                  onChange={(e) => {
                    const updated = [...socials];
                    updated[index].url = e.target.value;
                    setSocials(updated);
                  }}
                  sx={{ flex: 2, mr: '1px' }}
                />
                <IconButton
                  color="error"
                  onClick={() => {
                    setSocials((prev) =>
                      prev.filter((_, i) => i !== index)
                    );
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Stack>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setSocials((prev) => [
                ...prev,
                { platform: "", url: "" },
              ]);
            }}
            sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Add Social Media
          </Button>
        </Paper>
        <Stack spacing={2} mb={2}>
  {id != "add"  && customFields.map((field, index) => (
    <Box
      key={index}
      display="flex"
      gap={2}
      flexDirection={{ xs: "column", md: "row" }}
    >
      <TextField
        label="Key"
        value={field.key}
        onChange={(e) => {
          const updated = [...customFields];
          updated[index].key = e.target.value;
          setCustomFields(updated);
        }}
        fullWidth
        sx={{mb:1,mr:1}}
      />

      <TextField
        label="Value"
        value={field.value}
        onChange={(e) => {
          const updated = [...customFields];
          updated[index].value = e.target.value;
          setCustomFields(updated);
        }}
        fullWidth
      />
      <IconButton
        color="error"
        onClick={() => {
          setCustomFields((prev) =>
            prev.filter((_, i) => i !== index)
          );
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  ))}
</Stack>
        <Stack
          direction={{ xs: "column", md: "row" }}
          gap={2}
          spacing={2}
          mt={3}
          mb={3}
          sx={{ width: "100%", justifyContent: "space-between" }}
        >
          {id != "add"  && <Button
  variant="contained"
  onClick={() => {
    setCustomFields((prev) => [
      ...prev,
      { key: "", value: "" },
    ]);
  }}
  sx={{
    bgcolor: "#3E1A89",
    borderRadius: 3,
    mt: 2,
  }}
>
  + Add Custom Field
</Button>}

<Stack 
  direction="row"
  sx={{
    justifyContent: "space-between",
    mt: 3,
    pt: 2,
    borderTop: "1px solid #eee"
  }}
>
  <PrimaryButton type="submit">
    Submit
  </PrimaryButton>

  {/* <Button
    variant="outlined"
    color="error"
    sx={{borderRadius:'20px',ml:1}}
    onClick={() => setOpenDelete(true)}
  >
    
  </Button> */}
</Stack>
        </Stack>

<Dialog
  open={openDelete}
  onClose={() => setOpenDelete(false)}
>
  <DialogTitle>Delete Company</DialogTitle>

  <DialogContent>
    <Typography>
      Are you sure you want to delete ? This action cannot be undone.
    </Typography>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpenDelete(false)}>
      Cancel
    </Button>

    <Button
      color="error"
      variant="contained"
      
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>

        <Dialog
          open={openAddField}
          onClose={() => setOpenAddField(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add New Field</DialogTitle>
          <DialogContent>
            <Stack spacing={3} mt={1}>
              <TextField
                label="Field Label"
                value={newField.label}
                onChange={(e) =>
                  setNewField({
                    ...newField,
                    label: e.target.value,
                  })
                }
              />

              <TextField
                label="Field Key"
                value={newField.key}
                onChange={(e) =>
                  setNewField({
                    ...newField,
                    key: e.target.value,
                  })
                }
              />

              <FormControl fullWidth>
                <InputLabel>Field Type</InputLabel>

                <Select
                  value={newField.type}
                  label="Field Type"
                  onChange={(e) =>
                    setNewField({
                      ...newField,
                      type: e.target.value,
                    })
                  }
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="textarea">Textarea</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="number">Number</MenuItem>
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="url">URL</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Section</InputLabel>

                <Select
                  value={newField.section}
                  label="Section"
                  onChange={(e) =>
                    setNewField({
                      ...newField,
                      section: e.target.value,
                    })
                  }
                >
                  {profileSchema.map((section) => (
                    <MenuItem key={section.section} value={section.section}>
                      {section.section}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={newField.required}
                    onChange={(e) =>
                      setNewField({
                        ...newField,
                        required: e.target.checked,
                      })
                    }
                  />
                }
                label="Required"
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenAddField(false)}>Cancel</Button>

            <Button
              variant="contained"
              sx={{ bgcolor: "#3E1A89" }}
              onClick={handleAddField}
            >
              Add Field
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
