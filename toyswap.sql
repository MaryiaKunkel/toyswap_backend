\echo 'Delete and recreate toyswap db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE toyswap;
CREATE DATABASE toyswap;
\connect toyswap

\i toyswap-schema.sql
\i toyswap-seed.sql

\echo 'Delete and recreate toyswap_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE toyswap_test;
CREATE DATABASE toyswap_test;
\connect toyswap_test

\i toyswap-schema.sql
