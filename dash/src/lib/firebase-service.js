import { db, auth } from '../../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

// Collection names
const USERS_COLLECTION = 'users';
const ODDS_COLLECTION = 'odds';
const BETS_COLLECTION = 'bets';

// User functions
export const initializeUserProfile = async (uid, email) => {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const userSnapshot = await getDoc(userRef);
  
  if (!userSnapshot.exists()) {
    await setDoc(userRef, {
      email,
      points: 1000, // Initial points
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  
  return userRef;
};

export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnapshot = await getDoc(userRef);
    
    if (userSnapshot.exists()) {
      return { id: userSnapshot.id, ...userSnapshot.data() };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

export const updateUserPoints = async (uid, newPoints) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      points: newPoints,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user points:", error);
    throw error;
  }
};

// Odds functions
export const storeOdds = async (oddsData) => {
  try {
    const oddsRef = doc(db, ODDS_COLLECTION, 'current');
    await setDoc(oddsRef, {
      data: oddsData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error storing odds:", error);
    throw error;
  }
};

export const getOdds = async () => {
  try {
    const oddsRef = doc(db, ODDS_COLLECTION, 'current');
    const oddsSnapshot = await getDoc(oddsRef);
    
    if (oddsSnapshot.exists()) {
      return oddsSnapshot.data();
    }
    
    return null;
  } catch (error) {
    console.error("Error getting odds:", error);
    throw error;
  }
};

// Bet functions
export const placeBet = async (uid, betDetails) => {
  try {
    // Get user profile
    const userProfile = await getUserProfile(uid);
    
    if (!userProfile) {
      throw new Error("User profile not found");
    }
    
    const { points } = userProfile;
    const { amount, driver, position, odds } = betDetails;
    
    // Validate bet amount
    if (amount <= 0) {
      throw new Error("Bet amount must be greater than 0");
    }
    
    if (amount > points) {
      throw new Error("Not enough points");
    }
    
    // Create bet document
    const betRef = collection(db, BETS_COLLECTION);
    await addDoc(betRef, {
      userId: uid,
      driver,
      position,
      amount,
      odds,
      potentialWinnings: amount * odds,
      status: 'pending', // pending, won, lost
      createdAt: serverTimestamp(),
    });
    
    // Update user points
    await updateUserPoints(uid, points - amount);
    
    return { success: true };
  } catch (error) {
    console.error("Error placing bet:", error);
    throw error;
  }
};

export const getUserBets = async (uid) => {
  try {
    const betsQuery = query(
      collection(db, BETS_COLLECTION),
      where("userId", "==", uid)
    );
    
    const querySnapshot = await getDocs(betsQuery);
    const bets = [];
    
    querySnapshot.forEach((doc) => {
      bets.push({ id: doc.id, ...doc.data() });
    });
    
    return bets;
  } catch (error) {
    console.error("Error getting user bets:", error);
    throw error;
  }
};

// Helper to process CSV odds data for Firestore
export const processOddsData = (csvData) => {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',').slice(1); // P1, P2, etc.
  const result = {};
  
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',');
    const driver = row[0];
    const driverOdds = {};
    
    for (let j = 1; j < row.length; j++) {
      driverOdds[headers[j-1]] = parseFloat(row[j]);
    }
    
    result[driver] = driverOdds;
  }
  
  return result;
}; 