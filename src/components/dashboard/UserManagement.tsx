import React, { useState } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Button,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormGroup,
    FormControlLabel,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Email as EmailIcon,
} from '@mui/icons-material';

interface User {
    id: string;
    name: string;
    email: string;
    locations: {
        bali: boolean;
        komodo: boolean;
        jakarta: boolean;
    };
    weddingConfirmed: boolean;
    dateRegistered: string;
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([
        {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            locations: {
                bali: true,
                komodo: false,
                jakarta: true,
            },
            weddingConfirmed: true,
            dateRegistered: '2024-03-01',
        },
        // Tambahkan data dummy lainnya di sini
    ]);

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleAddUser = () => {
        setSelectedUser(null);
        setOpenDialog(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setOpenDialog(true);
    };

    const handleDeleteUser = (userId: string) => {
        setUsers(users.filter(user => user.id !== userId));
    };

    const handleSendInvite = (email: string) => {
        // Implementasi logika pengiriman email undangan
        console.log(`Sending invite to ${email}`);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">User Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddUser}
                >
                    Add New User
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Locations</TableCell>
                            <TableCell>Wedding Confirmed</TableCell>
                            <TableCell>Date Registered</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <FormGroup row>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={user.locations.bali}
                                                    size="small"
                                                />
                                            }
                                            label="Bali"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={user.locations.komodo}
                                                    size="small"
                                                />
                                            }
                                            label="Komodo"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={user.locations.jakarta}
                                                    size="small"
                                                />
                                            }
                                            label="Jakarta"
                                        />
                                    </FormGroup>
                                </TableCell>
                                <TableCell>
                                    <Checkbox checked={user.weddingConfirmed} />
                                </TableCell>
                                <TableCell>{user.dateRegistered}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditUser(user)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteUser(user.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleSendInvite(user.email)}>
                                        <EmailIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>
                    {selectedUser ? 'Edit User' : 'Add New User'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Name"
                            defaultValue={selectedUser?.name}
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            defaultValue={selectedUser?.email}
                            fullWidth
                        />
                        <Typography variant="subtitle2">Locations Access</Typography>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        defaultChecked={selectedUser?.locations.bali}
                                    />
                                }
                                label="Bali"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        defaultChecked={selectedUser?.locations.komodo}
                                    />
                                }
                                label="Komodo"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        defaultChecked={selectedUser?.locations.jakarta}
                                    />
                                }
                                label="Jakarta"
                            />
                        </FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    defaultChecked={selectedUser?.weddingConfirmed}
                                />
                            }
                            label="Wedding Confirmed"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserManagement; 