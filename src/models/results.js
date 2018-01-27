module.exports = function(sequelize, DataTypes) {
    var Result = sequelize.define(
        'result',
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            firstName: {
                type: DataTypes.STRING
            },
            lastName: {
                type: DataTypes.STRING
            },
            testId: {
                type: DataTypes.STRING
            },
            summaryMarksAvailable: {
                type: DataTypes.INTEGER
            },
            summaryMarksObtained: {
                type: DataTypes.INTEGER
            }
        },
        {}
    );
    Result.associate = function(models) {};
    return Result;
};
