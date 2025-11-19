import cors from "cors";

const corsOptions = {
  origin: '*',
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
};

export default cors(corsOptions);
