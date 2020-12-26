-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Discipline`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Discipline` (
  `idDiscipline` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(45) NOT NULL,
  `Hours` INT NOT NULL,
  `ControlType` VARCHAR(45) NOT NULL,
  `Mandatory` TINYINT NOT NULL,
  PRIMARY KEY (`idDiscipline`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Professor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Professor` (
  `idProfessor` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `FullName` VARCHAR(100) NOT NULL,
  `Department` VARCHAR(60) NOT NULL,
  `Position` VARCHAR(60) NOT NULL,
  `Degree` VARCHAR(60) NULL,
  PRIMARY KEY (`idProfessor`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Class`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Class` (
  `idClass` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Time` DATETIME NOT NULL,
  `Classroom` VARCHAR(10) NOT NULL,
  `Type` VARCHAR(15) NOT NULL,
  `GroupName` VARCHAR(15) NOT NULL,
  `idDiscipline` INT UNSIGNED NOT NULL,
  `idProfessor` INT UNSIGNED NULL,
  PRIMARY KEY (`idClass`, `idDiscipline`),
  INDEX `fk_Class_Discipline_idx` (`idDiscipline` ASC) VISIBLE,
  INDEX `fk_Class_Professor1_idx` (`idProfessor` ASC) VISIBLE,
  CONSTRAINT `fk_Class_Discipline`
    FOREIGN KEY (`idDiscipline`)
    REFERENCES `mydb`.`Discipline` (`idDiscipline`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Class_Professor1`
    FOREIGN KEY (`idProfessor`)
    REFERENCES `mydb`.`Professor` (`idProfessor`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123qwerty'
