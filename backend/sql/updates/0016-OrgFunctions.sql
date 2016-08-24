DROP FUNCTION IF EXISTS retrieveOrgAncestorIds;
DELIMITER $$
CREATE FUNCTION retrieveOrgAncestorIds(leafId INT) RETURNS VARCHAR(1000) CHARSET utf8
  BEGIN
    DECLARE sTemp VARCHAR(1000);
    DECLARE sTempChd VARCHAR(1000);

    SET sTemp = '';
    SET sTempChd = cast(leafId AS CHAR);

    WHILE sTempChd IS NOT NULL DO
      IF LENGTH(sTemp) > 0
      THEN
        SET sTemp = concat(sTempChd, ',', sTemp);
      ELSE
        SET sTemp = sTempChd;
      END IF;
      SELECT parent_id INTO sTempChd FROM organization WHERE id = sTempChd;
    END WHILE;
    RETURN sTemp;
  END$$
DELIMITER ;

DELIMITER $$
DROP FUNCTION IF EXISTS retrieveOrgSubParentId;
CREATE FUNCTION retrieveOrgSubParentId(pTopId INT, pOrgId INT) RETURNS INT
  BEGIN
    DECLARE vAncestorIds VARCHAR(1000);
    DECLARE vNumIDs INT;
    DECLARE vIdx INT;
    DECLARE vID VARCHAR(50);
    DECLARE vTopFound BOOL;

    SET vAncestorIds = retrieveOrgAncestorIds(pOrgId);
    SET vNumIDs = substrCount(',', vAncestorIds) + 1;
    SET vIdx = 1;
    SET vTopFound = FALSE;
    WHILE vIdx <= vNumIDs DO
      SET vID = CAST(splitStrAt(vAncestorIds, ',', vIdx) AS UNSIGNED);
      IF vID = pTopId
      THEN
        SET vTopFound = TRUE;
      ELSE
        IF vTopFound
        THEN
          RETURN vID;
        END IF;
      END IF;
      SET vIdx = vIdx + 1;
    END WHILE;
    RETURN 0;
  END$$
DELIMITER ;

DELIMITER $$
DROP FUNCTION IF EXISTS retrieveOrgSubParentName;
CREATE FUNCTION retrieveOrgSubParentName(pTopId INT, pOrgId INT) RETURNS TEXT CHAR SET UTF8
  BEGIN
    DECLARE vAncestorIds VARCHAR(1000);
    DECLARE vNumIDs INT;
    DECLARE vIdx INT;
    DECLARE vID VARCHAR(50);
    DECLARE vTopFound BOOL;
    DECLARE vName TEXT;

    SET vAncestorIds = retrieveOrgAncestorIds(pOrgId);
    SET vNumIDs = substrCount(',', vAncestorIds) + 1;
    SET vIdx = 1;
    SET vTopFound = FALSE;
    WHILE vIdx <= vNumIDs DO
      SET vID = CAST(splitStrAt(vAncestorIds, ',', vIdx) AS UNSIGNED);
      IF vID = pTopId
      THEN
        SET vTopFound = TRUE;
      ELSE
        IF vTopFound
        THEN
          SELECT name INTO vName FROM organization WHERE id=vID;
          RETURN vName;
        END IF;
      END IF;
      SET vIdx = vIdx + 1;
    END WHILE;
    RETURN NULL;
  END$$
DELIMITER ;

