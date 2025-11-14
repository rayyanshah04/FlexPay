# FlexPay Backend

Flask backend for FlexPay mobile application.

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Initialize the database:**
   ```bash
   python3 init_db.py
   ```

3. **Run the application:**
   ```bash
   python3 run.py
   ```

The server will start on `http://localhost:5000`

## Database Schema

The database includes the following tables:
- `users` - User accounts with authentication and balance
- `cards` - Virtual card details
- `beneficiaries` - User beneficiary relationships
- `transactions` - Payment transaction records
- `logs` - Application event logs

## API Endpoints

### Authentication
- `POST /api/signup` - Register new user
- `POST /api/login` - Login user

### Cards
- `POST /api/has_card` - Check if user has a card
- `POST /api/get_card` - Create a new virtual card
- `POST /api/get_card_details` - Get user's card details

### Balance
- `GET /api/balance` - Get user's balance

## Notes

- If you need to reset the database, delete `app/database.db` and run `python3 init_db.py` again
- Make sure to set up your `.env` file with `JWT_SECRET` if not already configured
