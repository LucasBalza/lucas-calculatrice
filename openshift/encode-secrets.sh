# Script pour encoder les secrets en base64

echo "JWT_SECRET (calculatrice-jwt-secret-2026):"
echo -n "calculatrice-jwt-secret-2026" | base64

echo ""
echo "MONGO_USERNAME (calculator_user):"
echo -n "calculator_user" | base64

echo ""
echo "MONGO_PASSWORD (SecurePass2026!):"
echo -n "SecurePass2026!" | base64