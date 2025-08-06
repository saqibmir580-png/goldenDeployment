


interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  image: string;
  isVerified: boolean;
  dob : String,
  address : String,
  gender : String,
  role : String
}

import image1 from "./assets/images/pass_perfect.jpg";
import image2 from "./assets/images/pass11.jpg"
import image3 from "./assets/images/pass3.jpg"
import image4 from "./assets/images/pass4.jpg"
import image5 from "./assets/images/pass15.webp"
import image6 from "./assets/images/pass6.jpg"
import image7 from "./assets/images/pass8.jfif"
import image8 from "./assets/images/pass2.jpg"

export const initialUsers: User[] = [
  {
    id: 1,
    fullName: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "1234567890",
    image:image1,
    isVerified: true,
    dob: "1990-01-01",  // string primitive
    address: "123 Main St, City",  // string primitive
    gender: "Male",  // string primitive
    role: "Admin"  // string primitive
  },
    { 
      id: 2, 
      fullName: "John Duize", 
      email: "john.duize@example.com", 
      phoneNumber: "+65 9876 5432", 
      image: image2, 
      isVerified: false,
      dob: "1988-09-23",
      address: "456 Bukit Timah Road, Singapore 259771",
      gender: "Male",
      role: "User"
    },
    { 
      id: 3, 
      fullName: "Captain Miller", 
      email: "captain.miller@example.com", 
      phoneNumber: "+65 8122 3344", 
      image: image3, 
      isVerified: true,
      dob: "1995-12-01",
      address: "789 Serangoon Avenue, Singapore 550789",
      gender: "Female",
      role: "Moderator"
    },
    { 
      id: 4, 
      fullName: "Sophie Tan", 
      email: "sophie.tan@example.com", 
      phoneNumber: "+65 8765 4321", 
      image: image4, 
      isVerified: true,
      dob: "1997-07-10",
      address: "321 Geylang Road, Singapore 389365",
      gender: "Female",
      role: "User"
    },
    { 
      id: 5, 
      fullName: "Ethan Wong", 
      email: "ethan.wong@example.com", 
      phoneNumber: "+65 9234 5678", 
      image: image5, 
      isVerified: false,
      dob: "1990-02-28",
      address: "147 Tampines Street, Singapore 520147",
      gender: "Male",
      role: "User"
    },
    { 
      id: 6, 
      fullName: "Aisha Rahman", 
      email: "aisha.rahman@example.com", 
      phoneNumber: "+65 9654 3210", 
      image: image6, 
      isVerified: true,
      dob: "1993-06-15",
      address: "258 Woodlands Avenue, Singapore 730258",
      gender: "Female",
      role: "Editor"
    },
    { 
      id: 7, 
      fullName: "Daniel Koh", 
      email: "daniel.koh@example.com", 
      phoneNumber: "+65 9321 8765", 
      image: image7, 
      isVerified: false,
      dob: "1985-11-05",
      address: "65 Paya Lebar Road, Singapore 409020",
      gender: "Male",
      role: "Guest"
    },
    { 
      id: 8, 
      fullName: "Olivia Chen", 
      email: "olivia.chen@example.com", 
      phoneNumber: "+65 9102 3456", 
      image: image8, 
      isVerified: true,
      dob: "2000-09-30",
      address: "85 Marina Bay Sands, Singapore 018956",
      gender: "Female",
      role: "User"
    }
  ];
  
