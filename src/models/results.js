module.exports = function(sequelize, DataTypes) {
    var Result = sequelize.define(
        'result',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false
            },
            first_name: {
                type: DataTypes.STRING
            },
            last_name: {
                type: DataTypes.STRING
            },
            test_id: {
                type: DataTypes.INTEGER
            },
            summary_marks_available: {
                type: DataTypes.INTEGER
            },
            summary_marks_obtained: {
                type: DataTypes.INTEGER
            }
        },
        {
            underscored: true
        }
    );
    Result.associate = function(models) {};
    return Result;
};
