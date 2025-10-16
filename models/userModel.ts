const database: Express.User[] = [
  {
    id: 1,
    admin: true,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
  },
  {
    id: 2,
    admin: false,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
  },
  {
    id: 3,
    admin: false,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
  },
  {
    id: 4,
    admin: true,
    name: "test",
    email: "test@mail.com",
    password: "test",
  },
];

const userModel = {
  findOne: (email: string): Express.User | null => {
    const user = database.find((user) => user.email === email);
    return user ?? null;
  },

  findById: (id: number): Express.User | null => {
    const user = database.find((user) => user.id === id);
    return user ?? null;
  },
};

export {database, userModel };
