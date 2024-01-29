\echo 'Delete and recreate movie_book?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE movie_book;
CREATE DATABASE movie_book;
\u movie_book

\. movie_book-schema.sql
