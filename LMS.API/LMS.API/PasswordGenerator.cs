using System;
using BCrypt.Net;

class Program
{
    static void Main()
    {
        string password = "Admin@123";
        string hash = BCrypt.HashPassword(password);
        Console.WriteLine($"Password: {password}");
        Console.WriteLine($"Hash: {hash}");
        
        // Test verification
        bool isValid = BCrypt.Verify(password, hash);
        Console.WriteLine($"Verification: {isValid}");
    }
}
