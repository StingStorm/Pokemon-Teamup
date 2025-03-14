import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getPokemons, getPokemonsSprites } from '../../services/services';

import type { Pokemon } from '../../types';

import Input from '../Input/Input';
import MultiSelect from '../MultiSelect/MultiSelect';
import Label from '../Label/Label';

type FormProps = {};

type FormValues = {
  firstName: string;
  lastName: string;
  team: string[];
};

const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, 'At least 2 chars')
    .max(12, 'Maximum 12 chars')
    .matches(/^[a-zA-Z]+$/, 'Letters only')
    .required('required'),
  lastName: yup
    .string()
    .min(2, 'At least 2 chars')
    .max(12, 'Maximum 12 chars')
    .matches(/^[a-zA-Z]+$/, 'Letters only')
    .required('required'),
  team: yup
    .array()
    .of(yup.string().required())
    .length(4, 'You must select exactly 4 pokemons')
    .required('required'),
});

const Form = (props: FormProps) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [sprites, setSprites] = useState<Pokemon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      team: [],
    },
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const formData = watch();

  useEffect(() => {
    getPokemons(20).then(data => {
      if (data) {
        setPokemons(data.results);
      }
    });
  }, []);

  const onSubmit = handleSubmit(async data => {
    const sprites1 = await getPokemonsSprites(data.team);
    setIsModalOpen(true);

    setSprites(sprites1 || []);
    console.log('response: ', sprites1);
    console.log('state: ', sprites);

    console.log('отправили форму, ', data);
  });

  return (
    <>
      <form
        onSubmit={onSubmit}
        className={`flex flex-col gap-y-4 w-[calc(400px+3rem)] p-6 bg-white rounded-lg`}
      >
        <h1 className="text-[2.25rem] font-bold text-center">
          Buttle Tower Team
        </h1>
        <Controller
          name="firstName"
          control={control}
          render={({ field, fieldState }) => (
            <div className="fieldWrapper">
              <Label htmlFor={field.name} hasError={!!fieldState.error}>
                Trainer Name
              </Label>
              <Input
                {...field}
                id={field.name}
                error={fieldState.error?.message}
                placeholder="Satoshi"
              />
              {errors.firstName && (
                <span className="errorMassege">
                  {errors.firstName?.message}
                </span>
              )}
            </div>
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field, fieldState }) => (
            <div className="fieldWrapper">
              <Label htmlFor={field.name} hasError={!!fieldState.error}>
                Trainer Surname
              </Label>
              <Input
                {...field}
                id={field.name}
                error={fieldState.error?.message}
                placeholder="Tajiri"
              />
              {errors.lastName && (
                <span className="errorMassege">{errors.lastName?.message}</span>
              )}
            </div>
          )}
        />
        <Controller
          name="team"
          control={control}
          render={({ field, fieldState }) => (
            <div className="fieldWrapper">
              <Label htmlFor={field.name} hasError={!!fieldState.error}>
                Select your Team
              </Label>
              <MultiSelect
                id={field.name}
                value={field.value}
                onChange={field.onChange}
                options={pokemons}
                placeholder="Select pokemon..."
                hasError={!!fieldState.error}
                maxSelections={4}
              />
              <span className="text-sm font-medium">
                Exactly 4 options must be selected
              </span>
            </div>
          )}
        />
        <button type="submit" className="appButton">
          Team Up!
        </button>
      </form>

      {isModalOpen && (
        <div className="fixed w-dvw h-dvh bg-black/50 flex justify-center items-center">
          <div className="flex flex-col gap-4 p-8 bg-white rounded-lg">
            <h2 className="text-3xl font-bold">Team Setup</h2>
            <div className="flex flex-col gap-1">
              <label htmlFor="trainerName">Trainer Name:</label>
              <input
                className="bg-purple-600/20 px-3 py-2 rounded-md"
                value={formData.firstName}
                id="trainerName"
                readOnly
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="trainerSurname">Tainer Surname:</label>
              <input
                className="bg-purple-600/20 px-3 py-2 rounded-md"
                value={formData.lastName}
                id="trainerSurname"
                readOnly
              />
            </div>

            <h3>Pokemons: </h3>
            <ul className="flex">
              {sprites.map(({ name, sprites }, index) => {
                return (
                  <li
                    className="flex flex-col justify-center items-center"
                    key={index + '33f'}
                  >
                    <img
                      src={sprites?.front_default}
                      alt={name}
                      width={96}
                      height={96}
                    ></img>
                    <span>{name}</span>
                  </li>
                );
              })}
            </ul>

            <button
              className="appButton"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Form;
