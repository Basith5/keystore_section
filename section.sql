CREATE TABLE section (
  id INT AUTO_INCREMENT PRIMARY KEY,
  keyname VARCHAR(255) NOT NULL,
  created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_on DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
