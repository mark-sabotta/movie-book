CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1)
);

CREATE TABLE movies (
  imdbid VARCHAR(25) PRIMARY KEY,
  title TEXT NOT NULL,
  poster TEXT
);

CREATE TABLE ratings (
  username VARCHAR(25)
    REFERENCES users ON DELETE CASCADE,
  imdbid VARCHAR(25)
    REFERENCES movies ON DELETE CASCADE,
  rating INTEGER NOT NULL,
  PRIMARY KEY (username, imdbid)
);
